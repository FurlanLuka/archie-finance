import { DynamicModule, Module } from '@nestjs/common';
import { MigrationGeneratorService } from './migration-generator.service';

@Module({})
export class MigrationGeneratorModule {
  static register(appModule: any): DynamicModule {
    return {
      providers: [MigrationGeneratorService],
      imports: [appModule],
      module: MigrationGeneratorModule,
    };
  }
}
