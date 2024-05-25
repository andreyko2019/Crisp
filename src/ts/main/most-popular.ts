import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { getElement, getElements } from '../composables/callDom';
import { fetchComposable } from '../composables/fetchComposable';
import { ShopFilters } from '../components/interface';

Swiper.use([Navigation, Autoplay]);

const swiperWrapper = getElement('.most-popular__swiper-wrapper');

export class PopularSwiper {
  swiper: Swiper | null;
  slidesArr: ShopFilters[];

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
              nextEl: '.swiper-btn-next.most-popular__swiper-btn-next',
              prevEl: '.swiper-btn-prew.most-popular__swiper-btn-prew',
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
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody: { structuredQuery: { from: { collectionId: string }[] } } = {
      structuredQuery: {
        from: [
          {
            collectionId: 'clothers',
          },
        ],
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<{ document: { fields: ShopFilters } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      response.data.forEach((doc) => {
        this.slidesArr.push(doc.document.fields);
      });
      console.log(this.slidesArr);
      this.renderSlides();
      this.hidden();
      if (this.swiper) {
        this.swiper.update();
      }
    }
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
                  <source srcset=${item.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.img.stringValue} />
                </picture>
              </div>
              <div class="card__info">
                <p class="card__category">${item.category.stringValue}</p>
                <h3 class="card__title">${item.name.stringValue}</h3>
                <p class="card__price">${item.cost.stringValue}</p>
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
