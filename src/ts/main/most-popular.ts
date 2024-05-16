import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { getDocQ, q, querySnapshot } from '../composables/useData';
import { getElement, getElements } from '../composables/callDom';

Swiper.use([Navigation, Autoplay]);

interface Slides {
  img: string;
  imgWebP: string;
  category: string;
  name: string;
  cost: string;
  costNew: string | undefined;
  sale: boolean;
}

const swiperWrapper = getElement('.most-popular__swiper-wrapper');

export class PopularSwiper {
  swiper: Swiper | null;
  slidesArr: Slides[];

  constructor() {
    this.swiper = null;
    this.slidesArr = [];
    this.initSwiper();
    this.loadCards();
  }

  initSwiper() {
    const initSwiperConfig = () => {
      if (window.innerWidth > 1023) {
        if (!this.swiper) {
          this.swiper = new Swiper('.most-popular__swiper', {
            slidesPerView: 5,
            spaceBetween: 30,
            grabCursor: true,
            navigation: {
              nextEl: '.swiper-btn-next',
              prevEl: '.swiper-btn-prew',
            },
            breakpoints: {
              1440: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
              1023: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            },
          });
        }
      } else {
        if (this.swiper) {
          this.swiper.destroy(true, true);
          this.swiper = null;
        }
        if (swiperWrapper) {
          swiperWrapper.classList.add('swiper-disabled');
        }
      }
    };

    window.addEventListener('resize', initSwiperConfig);
    initSwiperConfig();
  }

  async loadCards() {
    const queryRef = q('clothers', 8);
    const snapshot = await getDocQ(queryRef);
    querySnapshot(snapshot, (doc) => this.slidesArr.push(doc.data() as Slides));
    console.log(this.slidesArr);
    this.renderSlides();
    this.hidden();
  }

  renderSlides() {
    if (!swiperWrapper) {
      console.error('swiperWrapper is null');
      return;
    }

    this.slidesArr.forEach((item) => {
      swiperWrapper.insertAdjacentHTML(
        'beforeend',
        `
          <div class="most-popular__swiper-slide swiper-slide">
            <a class="card most-popular__card" href="#">
              <div class="card__img">
                <picture>
                  <source srcset=${item.imgWebP} type="image/webp" />
                  <img src=${item.img} />
                </picture>
              </div>
              <div class="card__info">
                <p class="card__category">${item.category}</p>
                <h3 class="card__title">${item.name}</h3>
                <p class="card__price">${item.cost}</p>
              </div>
            </a>
          </div>
        `
      );
    });
  }

  hidden() {
    const cards = getElements('.most-popular__swiper-slide');
    for (let i = 0; i < cards.length; i++) {
      if (window.innerWidth < 1023) {
        if (window.innerWidth > 576) {
          if (i < 6) {
            continue;
          } else {
            cards[i].classList.add('hidden');
          }
        } else {
          if (i < 4) {
            continue;
          } else {
            cards[i].classList.add('hidden');
          }
        }
      }
    }
  }
}
