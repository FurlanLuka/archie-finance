import { Module } from '@nestjs/common';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';

@Module({
  controllers: [Auth0Controller],
  providers: [Auth0Service]
})
export class Auth0Module {}
