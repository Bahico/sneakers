export interface PriceV2Model {
  price: number;
  priceWithoutDiscount: number;
  discount: boolean;
  is_express: boolean;
  priceWithExpress: number;
  priceWithExpressWithoutDiscount: number;
  priceFromAvailability: number;
  previousPriceFromAvailability: number;
  discountFromAvailability: boolean;
}
