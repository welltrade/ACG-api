export const data: Data = {
	item: []
}

interface Data {
	item: {
		id: String;
		brand: String;
		price: number;
		side: SideType //'sell' | 'buy';
	}[]
}

enum SideType {
	SELL = 'sell',
	BUY = 'buy',
}