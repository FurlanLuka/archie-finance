export enum ModuleType {
  PROJECT = 'PROJECT',
  PROJECT_FEATURE = 'PROJECT_FEATURE',
  SHARED = 'SHARED',
  SHARED_DATA_ACCESS = 'SHARED_DATA_ACCESS',
}

export interface UiModuleGeneratorSchema {
  projectName?: string;
  moduleName: string;
  moduleType: ModuleType;
}
