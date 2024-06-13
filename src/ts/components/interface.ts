export interface Slides {
  img: { stringValue: string };
  imgWebP: { stringValue: string };
}

export interface SlidesClothersRef extends Slides {
  subImg1?: { stringValue: string };
  subImgWebP1?: { stringValue: string };
  subImg2?: { stringValue: string };
  subImgWebP2?: { stringValue: string };
}

export interface ShopFilters extends Slides {
  category: { stringValue: string };
  name: { stringValue: string };
  cost: { stringValue: string };
  costNew: { stringValue: string | undefined };
  sale: { booleanValue: boolean };
}

export interface News {
  author: { stringValue: string };
  date: { stringValue: string };
  title: { stringValue: string };
  type: { stringValue: string };
  shortInfo: { stringValue: string };
}

export interface OneNew {
  newImg: { stringValue: string };
  newImgWebP: { stringValue: string };
  textTitle: { stringValue: string };
  textFirst: { stringValue: string };
  textSecond: { stringValue: string };
}

export interface OneDress {
  brand: { stringValue: string };
  name: { stringValue: string };
  cost: { stringValue: string };
  color: { arrayValue: { values: { stringValue: string }[] } };
  size: { arrayValue: { values: { stringValue: string }[] } };
}

export interface CustomEvent extends Event {
  readonly detail: { block: string; requiredImagesCount: number };
}
