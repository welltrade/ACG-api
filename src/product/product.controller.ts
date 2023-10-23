import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, Query} from "@nestjs/common"
import {ProductService} from "./product.service"
import { CreateProductDto, ProductResponseDto, UpdateProductDto } from "src/product/dtos/product.dto"
import { ProductStatus } from "@prisma/client"

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
    	@Param('id', ParseIntPipe) id: string
  	){
    	console.log({id})
    	return {}
  	}

	@Post()
	createProduct(
		@Body() { brand, model, price }: CreateProductDto ,
	){
		return { brand , model, price }
	}

	@Put(':id')
	updateProduct(
		@Param('id', ParseIntPipe) id: string,
		@Body() body: UpdateProductDto,
	){
		return {body, id}
	}

	@Delete('softdelete/:id')
	DeleteProduct(){
		return "Change to Deleted"
	}

	@Delete(':id')
	HardDeleteProduct(){
		return "Deleted"
	}

	@Get()
	getAllProductsByUser(){
		return {}
	}
}
