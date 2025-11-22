CREATE TABLE `mortgage_calculation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`mortgage_profile_id` int NOT NULL,
	`monthly_payment` double NOT NULL,
	`total_payment` double NOT NULL,
	`total_overpayment_amount` double NOT NULL,
	`possible_tax_deduction` double NOT NULL,
	`savings_due_mother_capital` double NOT NULL,
	`recommended_income` double NOT NULL,
	`payment_schedule` json NOT NULL,
	CONSTRAINT `mortgage_calculation_id` PRIMARY KEY(`id`),
	CONSTRAINT `mortgage_calculation_mortgage_profile_id_unique` UNIQUE(`mortgage_profile_id`)
);
--> statement-breakpoint
CREATE TABLE `mortgage_profile` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`property_price` double NOT NULL,
	`property_type` varchar(255) NOT NULL,
	`down_payment_amount` double NOT NULL,
	`mat_capital_amount` double,
	`mat_capital_included` boolean NOT NULL DEFAULT false,
	`loan_term_years` int NOT NULL,
	`interest_rate` double NOT NULL,
	CONSTRAINT `mortgage_profile_id` PRIMARY KEY(`id`)
);
