import { Injectable } from '@nestjs/common';




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
	getAllProducts(){
    	return 'All Items'
 	}
}
