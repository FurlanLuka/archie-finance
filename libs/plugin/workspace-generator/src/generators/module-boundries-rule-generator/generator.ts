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
      }
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

  updateJson(tree, joinPathFragments('./', '.eslintrc.json'), (json) => {
    const hasBoundariesRule =
      json['overrides'][0].rules['@nrwl/nx/enforce-module-boundaries'] !==
      undefined;

    if (hasBoundariesRule) {
      json['overrides'][0].rules[
        '@nrwl/nx/enforce-module-boundaries'
      ][1].depConstraints = [
        ...apiProjectLintConfiguration,
        ...uiProjectLintConfiguration,
        ...defaultLintConfiguration,
      ];
    }

    return json;
  });
}

export default microserviceProjectTargetGenerator;
