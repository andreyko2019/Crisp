import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
Swiper.use([Navigation, Pagination, Autoplay]);

export class SummerSale {
  swiper: Swiper;

  constructor() {
    this.swiper = new Swiper('.summer-sale__swiper', {
      slidesPerView: 2,
      //   autoplay: {
      //     delay: 3000,
      //   },
      loop: true,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
      },

      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prew',
      },
    });
  }
}
