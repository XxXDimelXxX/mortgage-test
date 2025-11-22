import { MortgageController } from './controllers/mortgage.controller';
import { Module } from '@nestjs/common';
import { MortgageService } from './services/mortgage.service';
import { RtfService } from './services/rtf.service';

@Module({
  controllers: [MortgageController],
  providers: [MortgageService, RtfService]
})
export class MortgageModule {}
