import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Body,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '@archie-microservices/auth0';
import { OnboardingDto, GetOnboardingResponseDto } from './onboarding.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('v1/onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async getOnboardingRecord(@Request() req): Promise<GetOnboardingResponseDto> {
    return this.onboardingService.getOrCreateOnboardingRecord(req.user.sub);
  }
}

@Controller('internal/onboarding')
export class InternalOnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Post('complete')
  async completeOnboardingStage(@Body() body: OnboardingDto): Promise<void> {
    await this.onboardingService.completeOnboardingStage(
      body.userId,
      body.stage,
    );
  }
}
