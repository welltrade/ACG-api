import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { ProductResponseDto } from "./dtos/product.dto";
import { ProductCondition, ProductCurrency, ProductStatus } from "@prisma/client";
import { UserInfo } from "src/user/decorators/user.decorator";




interface Product {
	amount: number;
	source: string;
}

interface UpdateProduct {
	amount?: number;
	source?: string;
}

interface GetProductsParam {
	status?: ProductStatus;
	brand?: string;
	model?: string;
	madeYear?: number;
	condition: ProductCondition;
	price?: {
		gte?: number;
		lte?: number;
	};
}

interface CreateProductParams {
        // userId: number;
        status: ProductStatus;
        brand: string;
        model: string;
        madeYear: number;
		condition: ProductCondition;
        description: string;
        price: number;
        currency: ProductCurrency;
        images: {url: string}[];
	}

interface UpdateProductParams {
        status?: ProductStatus;
        brand?: string;
        model?: string;
        madeYear?: number;
		// condition:
        description?: string;
        price?: number;
        currency?: ProductCurrency;
        // images: {url: string}[];
	}


@Injectable()
export class ProductService {

	constructor(private readonly prismaService: PrismaService){}

	async getAllProducts(filter:GetProductsParam):Promise<ProductResponseDto[]> {

    	const products = await this.prismaService.product.findMany({
			select:{
				id: true,
				status: true,
				brand: true,
				model: true,
				madeYear: true,
				condition: true,
				description: true,
				price: true,
				currency: true,
				images: {
					select: {
						url: true
					},
					take: 1
				},
				userId: true,
				createdAt: true
			},
			where: filter,
		});

		if(!products.length) {
			throw new NotFoundException();
		}
		return products.map((product) => {
			const fetchProduct = {...product, image: product.images[0].url}
			delete fetchProduct.images
			return new ProductResponseDto(fetchProduct)
		})

 	}

	async getProductById(id:number){
		const product = await this.prismaService.product.findFirst({
			where: {id}
		})

		if(!product) {
			throw new NotFoundException();
		}
		return new ProductResponseDto(product);
		// return product;
	}

	async createProduct({
		status,
        brand,
        model,
        madeYear,
		condition,
        description,
        price,
        currency,
		images}: CreateProductParams, userId: number){
		const product = await this.prismaService.product.create({
			data: {
					userId,
					status,
					brand,
					model,
					madeYear,
					condition,
					description,
					price,
					currency
			}
		})

		const productImages = images.map(image => {
			return {...image, productId: product.id}
		})

		await this.prismaService.image.createMany({data: productImages})

		return new ProductResponseDto(product);
	}

	async updateProductById(id: number, data: UpdateProductParams){
		// const product = this.getProductById(id)
		const product = await this.prismaService.product.findUnique({
			where: {id}
		})
		if(!product){
			throw new NotFoundException();
		}

		const updatedHome = await this.prismaService.product.update({
			where: {
				id
			},
			data
		})

		return new ProductResponseDto(updatedHome);
	}

	async deleteProductById(id: number){
		await this.prismaService.image.deleteMany({
			where: {
				productId: id
			}
		});

		await this.prismaService.product.delete({
			where: {
				id,
			}
		})
	}

	async getSellerByProductId(id: number){
		const product = await this.prismaService.product.findUnique({
			where: {
				id,
			},
			select: {
				user: {
					select: {
						id: true,
						userName: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true

					}
				}
			}
		})

		if(!product){
			throw new NotFoundException()
		}

		return product.user

	}

	async inquire(buyer: UserInfo, productId: number, message: string) {
		const seller = await this.getSellerByProductId(productId)

		return this.prismaService.message.create({
			data: {
				sellerId: seller.id,
				buyerId: buyer.id,
				productId,
				message

			}
		})
	}

	getMessagesByProduct(productId: number, ){
		return this.prismaService.message.findMany({
			where: {
				productId
			},
			select: {
				message: true,
				buyer: {
					select: {
						userName: true,
						firstName: true,
						lastName: true,
						phone: true,
						email: true
					}
				}
			}
		})
	}
}
