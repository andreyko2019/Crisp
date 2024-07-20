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
  length: { stringValue: string | undefined };
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

export interface OneDressBag extends OneDress {
  img: { stringValue: string };
  imgWebP: { stringValue: string };
}

export interface CustomEvent extends Event {
  readonly detail?: { block: string; requiredImagesCount: number };
}

export interface CustomValidator {
  fields: {
    [key: string]: {
      value: string;
    };
  };
}

export interface UserUid {
  uid: { stringValue: string };
}

export interface UserData extends UserUid {
  name: { stringValue: string };
  surname: { stringValue: string };
  email: { stringValue: string };
  billing?: { stringValue: string };
  shoppingAddress?: { stringValue: string };
  wishlistID?: { stringValue: string };
}

export interface Billing {
  country: { stringValue: string };
  city: { stringValue: string };
  street: { stringValue: string };
}

export interface Shopping extends Billing {
  phone: { stringValue: string };
  zip: { stringValue: string };
  company?: { stringValue: string };
  fax?: { stringValue: string };
}

export interface Wishlist {
  img: { stringValue: string };
  imgWebP: { stringValue: string };
  name: { stringValue: string };
  cost: { stringValue: string };
}
