import { IsBoolean, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateMortgageBodyDto {
  @IsUUID()
  userId: string;

  @IsNumber()
  @Min(1)
  propertyPrice: number;

  @IsString()
  propertyType: string;

  @IsNumber()
  @Min(0)
  downPaymentAmount: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  matCapitalAmount?: number;

  @IsBoolean()
  matCapitalIncluded: boolean;

  @IsNumber()
  @Min(1)
  loanTermYears: number;

  @IsNumber()
  @Min(0.1)
  interestRate: number;
}
