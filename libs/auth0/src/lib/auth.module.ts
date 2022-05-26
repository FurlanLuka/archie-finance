import { DynamicModule, Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthOptions } from './auth.interfaces';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({})
export class AuthModule {
  static register(options: AuthOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: [PassportModule, ...options.imports],
      providers: [
        {
          inject: options.inject,
          provide: 'AUTH_OPTIONS',
          useFactory: options.useFactory,
        },
        JwtStrategy,
      ],
      exports: [JwtStrategy],
      global: true,
    };
  }
}
