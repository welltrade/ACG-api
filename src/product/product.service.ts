import { Injectable } from '@nestjs/common';
import { PrismaService } from "src/prisma/prisma.service";
import { ProductResponseDto } from "./dtos/product.dto";




interface Product {
	amount: number;
	source: string;
}

interface UpdateProduct {
	amount?: number;
	source?: string;
}


@Injectable()
export class ProductService {

	constructor(private readonly prismaService: PrismaService){}

	async getAllProducts():Promise<ProductResponseDto[]> {

    	const products = await this.prismaService.product.findMany({
			select:{
				id: true,
				status: true,
				brand: true,
				model: true,
				madeYear: true,
				description: true,
				price: true,
				currency: true,
				images: {
					select: {
						url: true
					},
					take: 1
				}
			}
		});
		return products.map((product) => {
			const fetchProduct = {...product, image: product.images[0].url}
			delete fetchProduct.images
			return new ProductResponseDto(fetchProduct)
		})

 	}
}
