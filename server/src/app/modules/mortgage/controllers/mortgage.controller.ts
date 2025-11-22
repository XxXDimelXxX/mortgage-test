import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { CreateMortgageBodyDto } from '../dto/create-mortgage.body.dto';
import { MortgageService } from '../services/mortgage.service';
import { RtfService } from '../services/rtf.service';
import { Response } from 'express';

@Controller('mortgage')
export class MortgageController {
  constructor(
    private readonly mortgageService: MortgageService,
    private readonly rtfService: RtfService
  ) {}

  @Post()
  async create(@Body() body: CreateMortgageBodyDto) {
    return this.mortgageService.createMortgage(body);
  }

  @Get(':id/rtf')
  async downloadRtf(@Param('id') id: string, @Res() res: Response) {
    const data = await this.mortgageService.getCalculationData(+id);
    const rtfString = this.rtfService.generateMortgageRtf(data);

    const buffer = Buffer.from(rtfString, 'utf-8');

    res.setHeader('Content-Type', 'application/rtf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="mortgage_${id}.rtf"`
    );
    res.setHeader('Content-Length', buffer.length);

    res.end(buffer);
  }
}
