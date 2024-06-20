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
  brand: { stringValue: string };
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
