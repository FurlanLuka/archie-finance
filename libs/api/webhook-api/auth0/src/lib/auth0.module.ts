import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Auth0Controller } from './auth0.controller';
import { Auth0Service } from './auth0.service';
import { Auth0WebhookStrategy } from './guard/auth0.strategy';

@Module({
  imports: [PassportModule],
  controllers: [Auth0Controller],
  providers: [Auth0Service, Auth0WebhookStrategy],
})
export class Auth0Module {}
