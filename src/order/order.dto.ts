export class OrderDto {
  price_without_discount: number;
  discounted_price: number;
  campaign_id: number;
  user_id: number;
  product_ids: number[];
}
