import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules';
import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { ShopFilters } from '../components/interface';
import { Loader } from '../modules/stop-preload';

Swiper.use([Navigation, Autoplay]);

const swiperWrapper = getElement('.you-may-also-like__swiper-wrapper');

export class LikeSwiper {
  swiper: Swiper | null;
  slidesArr: { id: string; data: ShopFilters }[];

  constructor() {
    this.swiper = null;
    this.slidesArr = [];

    this.init().then(() => Loader.stop('you-may-also-like__swiper'));
  }

  async init() {
    this.initSwiper();
    this.loadCards();
  }

  initSwiper() {
    const initSwiperConfig = () => {
      if (window.innerWidth > 1023) {
        if (!this.swiper) {
          this.swiper = new Swiper('.you-may-also-like__swiper', {
            slidesPerView: 5,
            spaceBetween: 30,
            grabCursor: true,
            navigation: {
              nextEl: '.swiper-btn-next.you-may-also-like__swiper-btn-next',
              prevEl: '.swiper-btn-prew.you-may-also-like__swiper-btn-prew',
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
      const slide = renderElement('div', ['you-may-also-like__swiper-slide', 'swiper-slide']);

      const cardLink = renderElement('a', ['card', 'you-may-also-like__card', item.id]) as HTMLAnchorElement;
      cardLink.href = `one-product.html?id=${item.id}`;

      slide.appendChild(cardLink);

      const img = renderElement('div', 'card__img');
      img.innerHTML += `
            <picture>
              <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
              <img src=${item.data.img.stringValue} alt="img">
            </picture>
      `;

      const info = renderElement('div', 'card__info');

      const category = renderElement('p', 'card__category');
      category.innerText = item.data.category.stringValue;

      const title = renderElement('h3', 'card__title');
      title.innerText = item.data.name.stringValue;

      const price = renderElement('p', 'card__price');
      price.innerText = item.data.cost.stringValue;

      info.appendChild(category);
      info.appendChild(title);
      info.appendChild(price);

      cardLink.appendChild(img);
      cardLink.appendChild(info);

      swiperWrapper.appendChild(slide);
    });
  }

  hidden() {
    const cards = getElements('.you-may-also-like__swiper-slide');

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
