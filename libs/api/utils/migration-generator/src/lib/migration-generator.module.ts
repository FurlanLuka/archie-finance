import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class MigrationGeneratorModule {
  static register(appModule: any): DynamicModule {
    return {
      providers: [MigrationGeneratorModule],
      imports: [appModule],
      module: MigrationGeneratorModule,
    };
  }
}
