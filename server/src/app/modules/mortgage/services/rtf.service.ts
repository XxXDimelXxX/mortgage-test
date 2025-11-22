import { Injectable } from '@nestjs/common';
import { rtfEncode } from '../helper/rtfEscape';

@Injectable()
export class RtfService {
  generateMortgageRtf(data: any): string {
    const { profile, calculation, schedule } = data;

    const lines = [];

    // RTF header
    lines.push(`{\\rtf1\\ansi\\deff0`);
    lines.push(rtfEncode(`ИПОТЕЧНЫЙ РАСЧЁТ`) + `\\line`);
    lines.push(`\\line`);

    lines.push(rtfEncode(`ID профиля: ${profile.id}`) + `\\line`);
    lines.push(rtfEncode(`ID расчёта: ${calculation.id}`) + `\\line`);
    lines.push(
      rtfEncode(`Ежемесячный платёж: ${calculation.monthlyPayment} руб.`) +
        `\\line`
    );
    lines.push(`\\line`);

    lines.push(rtfEncode(`График платежей (первые 12 месяцев):`) + `\\line`);

    schedule.slice(0, 12).forEach((item: any) => {
      const row = `Месяц ${item.month}: проценты ${item.interestPayment}, тело ${item.principalPayment}, остаток ${item.remainingDebt}`;
      lines.push(rtfEncode(row) + `\\line`);
    });

    lines.push(`}`);

    return lines.join('\n');
  }
}
