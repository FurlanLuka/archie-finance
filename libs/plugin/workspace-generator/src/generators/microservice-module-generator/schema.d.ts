export interface MicroserviceModuleGeneratorSchema {
  projectName: string;
  name: string;
  moduleType: 'NORMAL' | 'SHARED' | 'SHARED_WITH_UI' | 'TEST_DATA_MODULE';
}
