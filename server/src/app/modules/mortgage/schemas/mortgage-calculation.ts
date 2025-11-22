import { mysqlTable, int, double, json, varchar } from 'drizzle-orm/mysql-core';

export const mortgageCalculation = mysqlTable('mortgage_calculation', {
  id: int('id').primaryKey().autoincrement(),

  userId: varchar('user_id', { length: 36 }).notNull(),

  mortgageProfileId: int('mortgage_profile_id').notNull().unique(),

  monthlyPayment: double('monthly_payment').notNull(),
  totalPayment: double('total_payment').notNull(),
  totalOverpaymentAmount: double('total_overpayment_amount').notNull(),
  possibleTaxDeduction: double('possible_tax_deduction').notNull(),
  savingsDueMotherCapital: double('savings_due_mother_capital').notNull(),
  recommendedIncome: double('recommended_income').notNull(),

  paymentSchedule: json('payment_schedule').notNull()
});
