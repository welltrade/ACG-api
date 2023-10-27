import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query, UnauthorizedException} from "@nestjs/common"
import {ProductService} from "./product.service"
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "src/product/dtos/product.dto"
import { ProductStatus } from "@prisma/client"
import { User, UserInfo } from "src/user/decorators/user.decorator"

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

	@Post()
	createProduct(
		@Body() body: CreateProductDto , @User() user: UserInfo
	){
		return this.productService.createProduct(body, user.id)
	}

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
}
