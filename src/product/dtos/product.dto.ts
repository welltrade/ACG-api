import {IsNumber, IsPositive, IsString, IsNotEmpty, IsOptional} from "class-validator"
import { Exclude, Expose } from "class-transformer"
import { ProductCurrency, ProductStatus } from "@prisma/client";



export class CreateProductDto {

	@IsString()
	@IsNotEmpty()
	brand: string;

	@IsString()
	@IsNotEmpty()
	model: string;

	@IsNumber()
	@IsPositive()
	price: number;

}

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	brand: string;

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	model: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	price: number;

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