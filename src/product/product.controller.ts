import {Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe} from "@nestjs/common"
import {ProductService} from "./product.service"
import { CreateProductDto, UpdateProductDto } from "src/dtos/product.dto"

@Controller('product')
export class ProductController {

	constructor(
    	private readonly ProductService: ProductService ){}

  	@Get('all')
  	getAllProducts(){
   		return {}
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