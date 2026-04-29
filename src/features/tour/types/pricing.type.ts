export interface Pricing {
  adultPrice: TicketPrice;
  childPrice: TicketPrice;
  infantPrice: TicketPrice;
  currency: string;
  singleSupplement: number;
}

export interface TicketPrice {
  originalPrice: number;
  discountPrice?: number | null;
}
