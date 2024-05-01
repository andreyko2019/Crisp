import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getDoc, querySnapshot } from '../composables/useData';
import { getElement } from '../composables/callDom';

Swiper.use([Navigation, Pagination, Autoplay]);

interface Slides {
  img: string;
  imgWebP: string;
}

const swiperWrapper = getElement('.summer-sale__swiper-wrapper');

export class SummerSale {
  swiper: Swiper;
  slidesArr: Slides[];

  constructor() {
    this.swiper = new Swiper('.summer-sale__swiper', {
      slidesPerView: 2,
      autoplay: {
        delay: 10000,
      },
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
      },

      navigation: {
        nextEl: '.swiper-btn-next',
        prevEl: '.swiper-btn-prew',
      },
    });
    this.slidesArr = [];
    this.loadCards();
  }

  async loadCards() {
    querySnapshot(await getDoc('main-swiper'), (doc) => this.slidesArr.push(doc.data() as Slides));
    console.log(this.slidesArr);
    this.renderSldes();
  }

  renderSldes() {
    this.slidesArr.forEach((item) => {
      if (swiperWrapper) {
        swiperWrapper.insertAdjacentHTML(
          'beforeend',
          `
          <div class="swiper-slide summer-sale__slide">
            <picture>
              <source srcset=${item.imgWebP} type="image/webp" />
              <img src=${item.img}/>
            </picture>
          </div>
          `
        );
      }
    });
  }
}
