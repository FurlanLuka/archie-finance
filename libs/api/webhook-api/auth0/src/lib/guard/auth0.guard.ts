import { Injectable } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';

@Injectable()
export class Auth0WebhookGuard extends PassportAuthGuard('auth0-webhook') {}
