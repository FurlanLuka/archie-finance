import { joinPathFragments, Tree, updateJson } from '@nrwl/devkit';
import { readWorkspace } from 'nx/src/generators/utils/project-configuration';

export function microserviceProjectTargetGenerator(tree: Tree): void {
  const workspace = readWorkspace(tree);

  const apiProjects = Object.keys(workspace.projects).flatMap((projectKey) => {
    const project = workspace.projects[projectKey];

    if (project.root.includes('apps/api')) {
      return [projectKey];
    }

    return [];
  });

  const uiProjects = Object.keys(workspace.projects).flatMap((projectKey) => {
    const project = workspace.projects[projectKey];

    if (project.root.includes('apps/ui')) {
      return [projectKey];
    }

    return [];
  });

  const testProjects = Object.keys(workspace.projects).flatMap((projectKey) => {
    const project = workspace.projects[projectKey];

    if (project.root.includes('apps/tests')) {
      return [projectKey];
    }

    return [];
  });

  const defaultLintConfiguration = [
    {
      sourceTag: 'scope:api:lib:shared',
      onlyDependOnLibsWithTags: ['scope:api:lib:shared'],
    },
    {
      sourceTag: 'scope:api:lib:test-data',
      onlyDependOnLibsWithTags: ['*'],
    },
    {
      sourceTag: 'scope:ui:lib:shared',
      onlyDependOnLibsWithTags: ['scope:ui:lib:shared'],
    },
    {
      sourceTag: 'scope:tests:lib:shared',
      onlyDependOnLibsWithTags: [
        'scope:tests:lib:shared',
        'scope:api:lib:shared',
      ],
    },
  ];

  const apiProjectLintConfiguration = apiProjects.flatMap((project) => {
    return [
      {
        sourceTag: `scope:api:app:${project}`,
        onlyDependOnLibsWithTags: [
          `scope:api:lib:${project}`,
          `scope:api:lib:${project}:shared`,
          `scope:api:lib:shared`,
          `scope:api:lib:test-data`,
        ],
      },
      {
        sourceTag: `scope:api:lib:${project}`,
        onlyDependOnLibsWithTags: [
          `scope:api:lib:${project}:shared`,
          'scope:api:lib:shared',
        ],
      },
      {
        sourceTag: `scope:api:lib:${project}:shared`,
        onlyDependOnLibsWithTags: [
          `scope:api:lib:${project}:shared`,
          'scope:api:lib:shared',
        ],
      },
    ];
  });

  const uiProjectLintConfiguration = uiProjects.flatMap((project) => {
    return [
      {
        sourceTag: `scope:ui:app:${project}`,
        onlyDependOnLibsWithTags: [
          `scope:ui:lib:${project}`,
          `scope:ui:lib:${project}:shared`,
          `scope:ui:lib:shared`,
        ],
      },
      {
        sourceTag: `scope:ui:lib:${project}`,
        onlyDependOnLibsWithTags: [
          `scope:ui:lib:${project}:shared`,
          'scope:ui:lib:shared',
        ],
      },
    ];
  });

  const testsProjectLintConfiguration = testProjects.flatMap((project) => {
    return [
      {
        sourceTag: `scope:tests:app:${project}`,
        onlyDependOnLibsWithTags: [
          'scope:tests:lib:shared',
          'scope:api:lib:shared',
          'scope:api:lib:test-data',
          `scope:tests:lib:${project}`,
        ],
      },
      {
        sourceTag: `scope:tests:lib:${project}`,
        onlyDependOnLibsWithTags: [
          `scope:tests:lib:${project}`,
          'scope:tests:lib:shared',
          'scope:api:lib:shared',
          'scope:api:lib:test-data',
          `scope:tests:lib:${project}:shared`,
        ],
      },
    ];
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updater = (json: any): any => {
    const hasBoundariesRule =
      json['overrides'][0].rules['@nrwl/nx/enforce-module-boundaries'] !==
      undefined;

    if (hasBoundariesRule) {
      json['overrides'][0].rules[
        '@nrwl/nx/enforce-module-boundaries'
      ][1].depConstraints = [
        ...apiProjectLintConfiguration,
        ...uiProjectLintConfiguration,
        ...testsProjectLintConfiguration,
        ...defaultLintConfiguration,
      ];
    }

    return json;
  };

  updateJson(tree, joinPathFragments('./', '.eslintrc.json'), updater);
  updateJson(tree, joinPathFragments('./', '.eslintrc.ui.json'), updater);
}

export default microserviceProjectTargetGenerator;
