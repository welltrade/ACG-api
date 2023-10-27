import {IsNumber, IsPositive, IsString, IsNotEmpty, IsOptional, IsEnum, IsArray, ValidateNested} from "class-validator"
import { Exclude, Expose, Type } from "class-transformer"
import { ProductCurrency, ProductStatus } from "@prisma/client";


class Image {
	@IsString()
	@IsNotEmpty()
	url:string;
}
export class CreateProductDto {

	@IsNumber()
	@IsPositive()
	userId: number;

	@IsEnum(ProductStatus)
	status: ProductStatus;

	@IsString()
	@IsNotEmpty()
	brand: string;

	@IsString()
	@IsNotEmpty()
	model: string;

	@IsNumber()
	@IsPositive()
	madeYear: number;

	// condition:

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsNumber()
	@IsPositive()
	price: number;

	@IsEnum(ProductCurrency)
	currency: ProductCurrency;

	@IsArray()
	@ValidateNested({each: true})
	@Type(() => Image)
	images: Image[];



}

export class UpdateProductDto {
	@IsOptional()
	@IsEnum(ProductStatus)
	status?: ProductStatus;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	brand?: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	model?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	madeYear?: number;

	// condition:

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	price?: number;

	@IsOptional()
	@IsEnum(ProductCurrency)
	currency?: ProductCurrency;

	// @IsOptional()
	// @IsArray()
	// @ValidateNested({each: true})
	// @Type(() => Image)
	// images: Image[];

}

export class ProductResponseDto {


	id: number;
	status: ProductStatus;
	brand: string;
	model: string;
	madeYear: number;
	description: string;
	price: number;
	currency: ProductCurrency;
	image: string;


	@Exclude()
	userId: number;
	@Exclude()
	createdAt: Date;
	@Exclude()
	updatedAt: Date;

	constructor(partial: Partial<ProductResponseDto>){
		Object.assign(this, partial);
	}



	// brand: string;
	// model: string;

	// price: number;

	// @Exclude()
	// created_at: Date;

	// @Expose({name: "createdAt"})
	// transformCreatedAt() {
	// 	return this.created_at;
	// }

	// constructor(partial: Partial<ProductResponseDto>){
	// 	Object.assign(this, partial);
	// }
}