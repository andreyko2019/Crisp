import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { getElement, getElements } from '../composables/callDom';
import { fetchComposable } from '../composables/useFetch';
import { ShopFilters } from '../components/interface';

Swiper.use([Navigation, Autoplay]);

const swiperWrapper = getElement('.featured-items__swiper-wrapper');

export class FeaturedSwiper {
  swiper: Swiper | null;
  slidesArr: { id: string; data: ShopFilters }[];

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
              nextEl: '.swiper-btn-next.featured-items__swiper-btn-next',
              prevEl: '.swiper-btn-prew.featured-items__swiper-btn-prew',
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

    const response = await fetchComposable<{ document: { name: string; fields: ShopFilters } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      response.data.forEach((doc) => {
        const docId = doc.document.name.split('/').pop() || '';
        this.slidesArr.push({ id: docId, data: doc.document.fields });
      });
      console.log(this.slidesArr);
      this.renderSlides();
      this.loadMore();
      if (this.swiper) {
        this.swiper.update(); // Update the Swiper after adding slides
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
          <div class="featured-items__swiper-slide swiper-slide">
            <a class="card featured-items__card ${item.id}" href="one-product.html?id=${item.id}">
              <div class="card__img">
                <picture>
                  <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
                  <img src=${item.data.img.stringValue} />
                </picture>
              </div>
              <div class="card__info">
                <p class="card__category">${item.data.category.stringValue}</p>
                <h3 class="card__title">${item.data.name.stringValue}</h3>
                <p class="card__price">${item.data.cost.stringValue}</p>
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
          btn.classList.add('hidden');
        }
      });
    }
  }
}
