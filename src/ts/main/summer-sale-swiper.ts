import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Slides } from '../components/interface';
import { Loader } from '../modules/stop-preload';

Swiper.use([Navigation, Pagination, Autoplay]);

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
    this.loadCards().then(() => {
      Loader.stop('summer-sale');
    });
  }
  async loadCards() {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody: { structuredQuery: { from: { collectionId: string }[] } } = {
      structuredQuery: {
        from: [
          {
            collectionId: 'main-swiper',
          },
        ],
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<{ document: { fields: Slides } }[], typeof requestBody>(url, {
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
      this.renderSlides();
      this.swiper.update();
    }
  }

  renderSlides() {
    this.slidesArr.forEach((item) => {
      if (swiperWrapper) {
        const slide = renderElement('div', ['swiper-slide', 'summer-sale__slide']);
        slide.innerHTML = `
            <picture>
              <source srcset=${item.imgWebP.stringValue} type="image/webp" />
              <img src=${item.img.stringValue}/>
            </picture>
        `;

        swiperWrapper.appendChild(slide);
      }
    });
  }
}
