export interface Slides {
  img: { stringValue: string };
  imgWebP: { stringValue: string };
}

export interface ShopFilters extends Slides {
  category: { stringValue: string };
  name: { stringValue: string };
  cost: { stringValue: string };
  costNew: { stringValue: string | undefined };
  sale: { booleanValue: boolean };
}
