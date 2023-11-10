import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, UnauthorizedException} from "@nestjs/common"
import {ProductService} from "./product.service"
import { CreateProductDto, InquireDto, ProductResponseDto, UpdateProductDto } from "src/product/dtos/product.dto"
import { ProductCondition, ProductStatus, UserRole } from "@prisma/client"
import { User, UserInfo } from "src/user/decorators/user.decorator"
import {Roles} from "src/decorators/roles.decorator"

@Controller('product')
export class ProductController {

	constructor(private readonly productService: ProductService ){}

  	@Get('all')
  	getAllProducts(
		@Query('brand') brand?: string,
		@Query('minPrice') minPrice?: string,
		@Query('maxPrice') maxPrice?: string,
		@Query('model') model?: string,
		@Query('madeYear') madeYear?: number,
		@Query('condition') condition?: ProductCondition,
		@Query('status') status?: ProductStatus,
		// Quality ?
		// @Query('brand') brand?: string,
	): Promise<ProductResponseDto[]> {

		const price = minPrice || maxPrice ? {
			...(minPrice && {gte: parseFloat(minPrice)}),
			...(maxPrice && {lte: parseFloat(maxPrice)}),
		} : undefined

		const filters = {
			...(brand && {brand}) ,
			...(price && {price}) ,
			...(model && {model}),
			...(condition && {condition}),
			...(madeYear && {madeYear}),
			...(status && {status}),
		}


   		return this.productService.getAllProducts(filters)
  	}


  	@Get(':id')
  	getProductById(
    	@Param('id', ParseIntPipe) id: number
  	){
    	return this.productService.getProductById(id)
  	}

	@Roles(UserRole.SELLER, UserRole.ADMIN)
	@Post()
	createProduct(
		@Body() body: CreateProductDto , @User() user: UserInfo
	){
		return this.productService.createProduct(body, user.id)
	}


	@Roles(UserRole.SELLER, UserRole.ADMIN)
	@Put(':id')
	async updateProduct(
		@Param('id', ParseIntPipe) id: number,
		@Body() body: UpdateProductDto,
		@User() user: UserInfo
	){
		const seller = await this.productService.getSellerByProductId(id);

		if(seller.id !== user.id){
			throw new UnauthorizedException()
		}

		return this.productService.updateProductById(id, body)
	}


	@Roles(UserRole.SELLER, UserRole.ADMIN)
	@Delete('softdelete/:id')
	async deleteProduct(
		@Param('id', ParseIntPipe) id: number,
		@User() user: UserInfo
	){
		const seller = await this.productService.getSellerByProductId(id);

		if(seller.id !== user.id){
			throw new UnauthorizedException()
		}

		return this.productService.updateProductById(id, {status: 'DELETED'})
	}

	@Roles(UserRole.SELLER, UserRole.ADMIN)
	@Delete(':id')
	async hardDeleteProduct(
		@Param('id', ParseIntPipe) id: number,
		@User() user: UserInfo
	){

		const seller = await this.productService.getSellerByProductId(id);

		if(seller.id !== user.id){
			throw new UnauthorizedException()
		}

		return this.productService.deleteProductById(id)
	}

	@Get()
	getAllProductsByUser(){
		return {}
	}

	@Roles(UserRole.BUYER)
	@Post('/:id/inquire')
	inquire(
		@Param('id', ParseIntPipe) productId: number,
		@User() user: UserInfo,
		@Body() {message}: InquireDto
	){
		return this.productService.inquire(user, productId, message)
	}


	@Roles(UserRole.SELLER, UserRole.ADMIN)
	@Get('/:id/messages')
	async getProductMessages(
		@Param('id', ParseIntPipe) productId: number,
		@User() user: UserInfo
	)
	{
		const seller = await this.productService.getSellerByProductId(productId);

		if(seller.id !== user.id){
			throw new UnauthorizedException()
		}

		return this.productService.getMessagesByProduct(productId)
	}
}
