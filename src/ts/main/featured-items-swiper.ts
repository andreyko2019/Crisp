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

const swiperWrapper = getElement('.featured-items__swiper-wrapper');

export class FeaturedSwiper {
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
          this.swiper = new Swiper('.featured-items__swiper', {
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
    this.loadMore();
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
          <div class="featured-items__swiper-slide swiper-slide">
            <a class="card featured-items__card" href="#">
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

  loadMore() {
    this.hidden();
    this.btnLoad();
  }

  hidden() {
    const cards = getElements('.featured-items__swiper-slide');
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

  btnLoad() {
    const cards = getElements('.featured-items__swiper-slide');
    const wrapper = getElement('.featured-items__swiper');
    if (cards.length > 6 && wrapper && window.innerWidth <= 1023) {
      const loadMoreButton = document.createElement('button');
      loadMoreButton.classList.add('btn', 'featured-items__load');
      loadMoreButton.textContent = 'See more';
      wrapper.insertAdjacentElement('beforeend', loadMoreButton);
    }
    const btn = getElement('.featured-items__load');
    if (btn) {
      btn.addEventListener('click', () => {
        const hiddenCards = getElements('.featured-items__swiper-slide.hidden');
        for (let i = 0; i < hiddenCards.length && i < 6; i++) {
          hiddenCards[i].classList.remove('hidden');
        }
        const remainingHiddenCards = getElements('.featured-items__swiper-slide.hidden');
        if (remainingHiddenCards.length === 0) {
          btn.classList.add('hidden'); // Hide the button
        }
      });
    }
  }
}
