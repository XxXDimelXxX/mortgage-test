import {
  mysqlTable,
  int,
  varchar,
  boolean,
  double
} from 'drizzle-orm/mysql-core';

export const mortgageProfile = mysqlTable('mortgage_profile', {
  id: int('id').primaryKey().autoincrement(),

  userId: varchar('user_id', { length: 36 }).notNull(),

  propertyPrice: double('property_price').notNull(),
  propertyType: varchar('property_type', { length: 255 }).notNull(),

  downPaymentAmount: double('down_payment_amount').notNull(),

  matCapitalAmount: double('mat_capital_amount'),
  matCapitalIncluded: boolean('mat_capital_included').notNull().default(false),

  loanTermYears: int('loan_term_years').notNull(),
  interestRate: double('interest_rate').notNull()
});
