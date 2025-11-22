import { Inject, Injectable } from '@nestjs/common';

import { CreateMortgageBodyDto } from '../dto/create-mortgage.body.dto';
import { Database } from '../../../../database/schema';
import { mortgageProfile } from '../schemas/mortgage-profile';
import { mortgageCalculation } from '../schemas/mortgage-calculation';
import { eq } from 'drizzle-orm';

@Injectable()
export class MortgageService {
  constructor(
    @Inject('DATABASE')
    private readonly db: Database
  ) {}

  async createMortgage(body: CreateMortgageBodyDto) {
    const calculation = this.calculateMortgage(body);

    const [profile] = await this.db
      .insert(mortgageProfile)
      .values({
        userId: body.userId,
        propertyPrice: body.propertyPrice,
        propertyType: body.propertyType,
        downPaymentAmount: body.downPaymentAmount,
        matCapitalAmount: body.matCapitalAmount,
        matCapitalIncluded: body.matCapitalIncluded,
        loanTermYears: body.loanTermYears,
        interestRate: body.interestRate
      })
      .$returningId();

    const [calculationRecord] = await this.db
      .insert(mortgageCalculation)
      .values({
        userId: body.userId,
        mortgageProfileId: profile.id,
        monthlyPayment: calculation.monthlyPayment,
        totalPayment: calculation.totalPayment,
        totalOverpaymentAmount: calculation.totalOverpaymentAmount,
        possibleTaxDeduction: calculation.possibleTaxDeduction,
        savingsDueMotherCapital: calculation.savingsDueMotherCapital,
        recommendedIncome: calculation.recommendedIncome,
        paymentSchedule: calculation.paymentSchedule
      })
      .$returningId();

    return {
      profile,
      calculation: calculationRecord,
      schedule: calculation.paymentSchedule
    };
  }

  private calculateMortgage(body: CreateMortgageBodyDto) {
    const {
      propertyPrice,
      downPaymentAmount,
      matCapitalAmount = 0,
      matCapitalIncluded,
      loanTermYears,
      interestRate
    } = body;

    // сумма кредита
    const loanAmount =
      propertyPrice -
      downPaymentAmount -
      (matCapitalIncluded ? matCapitalAmount : 0);

    // месячная ставка
    const monthlyRate = interestRate / 12 / 100;

    // количество месяцев
    const totalMonths = loanTermYears * 12;

    // ежемесячный платеж (аннуитет)
    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // общая сумма выплат
    const totalPayment = monthlyPayment * totalMonths;

    // переплата
    const overpayment = totalPayment - loanAmount;

    // налоговые вычеты
    const taxDeductionProperty = Math.min(propertyPrice, 2_000_000) * 0.13;
    const taxDeductionInterest = Math.min(overpayment, 3_000_000) * 0.13;

    const possibleTaxDeduction = taxDeductionProperty + taxDeductionInterest;

    // график платежей
    const schedule = [];
    let remainingDebt = loanAmount;

    for (let month = 1; month <= totalMonths; month++) {
      const interestForMonth = remainingDebt * monthlyRate;
      const principalForMonth = monthlyPayment - interestForMonth;
      const endingBalance = remainingDebt - principalForMonth;

      schedule.push({
        month,
        interestPayment: Number(interestForMonth.toFixed(2)),
        principalPayment: Number(principalForMonth.toFixed(2)),
        remainingDebt: Number(endingBalance.toFixed(2))
      });

      remainingDebt = endingBalance;
    }

    const recommendedIncome = monthlyPayment * 3;

    return {
      loanAmount: Number(loanAmount.toFixed(2)),
      monthlyPayment: Number(monthlyPayment.toFixed(2)),
      totalPayment: Number(totalPayment.toFixed(2)),
      totalOverpaymentAmount: Number(overpayment.toFixed(2)),
      possibleTaxDeduction: Number(possibleTaxDeduction.toFixed(2)),
      savingsDueMotherCapital: matCapitalIncluded
        ? Number(matCapitalAmount)
        : 0,
      recommendedIncome: Number(recommendedIncome.toFixed(2)),
      paymentSchedule: schedule
    };
  }

  async getCalculationData(id: number) {
    const calculationRows = await this.db
      .select()
      .from(mortgageCalculation)
      .where(eq(mortgageCalculation.id, id));

    const calculation = calculationRows[0];
    if (!calculation) throw new Error('Calculation not found');

    const profileRows = await this.db
      .select()
      .from(mortgageProfile)
      .where(eq(mortgageProfile.id, calculation.mortgageProfileId));

    const profile = profileRows[0];

    let schedule;

    const raw = calculation.paymentSchedule as any;

    if (typeof raw === 'string') {
      schedule = JSON.parse(raw);
    } else {
      schedule = raw;
    }

    return {
      profile,
      calculation,
      schedule
    };
  }
}
