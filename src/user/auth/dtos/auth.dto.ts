import { UserRole } from "@prisma/client";
import {IsString, IsNotEmpty, IsEmail, MinLength, Matches, IsEnum, IsOptional} from "class-validator"


export class SignupDto {
	@IsNotEmpty()
	@IsString()
	userName: string;

	@IsNotEmpty()
	@IsString()
	firstName: string;

	@IsNotEmpty()
	@IsString()
	lastName: string;

	@Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {message: "phone must be a valid phone number"})
	phone: string;

	@IsEmail()
	email: string;

	@IsString()
	@MinLength(5)
	password: string;

	@IsOptional()
	@IsEnum(UserRole)
	userRole?: UserRole;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	productKey?: string;
}

export class SigninDto {
	// @IsNotEmpty()
	// @IsString()
	// userName: string;

	// @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {message: "phone must be a valid phone number"})
	// phone: string;

	@IsEmail()
	email: string;

	@IsString()
	password: string;
}

export class GenerateProductKeyDto {
	@IsEmail()
	email: string;

	@IsEnum(UserRole)
	userRole: UserRole;
}