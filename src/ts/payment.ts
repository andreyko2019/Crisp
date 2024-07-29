
import { dropdownWork } from './catalog/dropdown';
import { paymentMethod } from './payment/paymentMethod';
import { AddToBag } from './one-product/add-to-bag';
import { RenderInfoFromBag } from './payment/randerInfoFromBag';

document.addEventListener('DOMContentLoaded', async () => {
  dropdownWork();
  paymentMethod();
  new AddToBag();
  new RenderInfoFromBag();
});


