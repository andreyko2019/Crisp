import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import { getElement, getElements } from '../composables/callDom';
import 'swiper/swiper-bundle.css';
import { SlidesClothersRef } from '../components/interface';
import { Tabs } from '../components/tabs';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

Swiper.use([Pagination, Autoplay]);

const clothersWrapperItem = getElement('.main-img__swiper-wrapper');
const clothersWrapperTabs = getElement('.main-info__all-img');

export class MainInfoSwiper {
  swiper: Swiper | null;
  slidesArr: SlidesClothersRef | null;

  constructor() {
    this.swiper = null;
    this.slidesArr = null;

    this.init().then(() => Loader.stop('main-info__tabs'));
  }

  async init() {
    this.conectDb();
  }

  private initSwiper() {
    const slideElements = getElements('.main-img__slide');
    if (slideElements.length > 1) {
      this.swiper = new Swiper('.main-img__swiper', {
        slidesPerView: 1,
        autoplay: {
          delay: 10000,
        },
        pagination: {
          el: '.swiper-pagination',
        },
        grabCursor: true,
        on: {
          slideChange: () => this.onSlideChange(),
        },
      });
      this.initTabsSync();
    } else {
      // Disable autoplay and pagination if there is only one slide
      const swiperContainer = getElement('.main-img__swiper');
      if (swiperContainer) {
        swiperContainer.classList.remove('swiper-container-initialized', 'swiper-container-horizontal');
      }
    }
  }

  private initTabsSync() {
    const tabsBtns = getElements('.tabs__nav-btn') as NodeListOf<HTMLElement>;

    tabsBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        console.log(`Tab ${index + 1} clicked`);
        if (this.swiper) {
          this.swiper.slideTo(index);
        }
      });
    });
  }

  private onSlideChange() {
    const tabsBtns = getElements('.tabs__nav-btn') as NodeListOf<HTMLElement>;

    tabsBtns.forEach((btn, index) => {
      if (this.swiper && index === this.swiper.realIndex) {
        btn.classList.add('tabs__nav-btn_active');
      } else {
        btn.classList.remove('tabs__nav-btn_active');
      }
    });
  }

  private async conectDb() {
    const docId = this.getDocumentIdFromURL();

    if (!docId) {
      console.error('Document ID not found in URL');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${docId}`;

    const response = await fetchComposable<{ fields: SlidesClothersRef }, null>(url, {
      method: 'GET',
    });

    if (response.error) {
      console.error('Error fetching document:', response.error);
      return;
    }

    if (response.data) {
      this.slidesArr = response.data.fields;
      console.log(this.slidesArr);
      this.renderSlides();
      this.initSwiper();
      new Tabs();
    }
  }

  getDocumentIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  renderSlides() {
    if (clothersWrapperItem && clothersWrapperTabs && this.slidesArr) {
      const { img, subImg1, subImg2, subImgWebP1, subImgWebP2 } = this.slidesArr;

      if (img && subImg1 && subImg2 && subImgWebP1 && subImgWebP2) {
        clothersWrapperTabs.innerHTML = `
          <button class="tabs__nav-btn tabs__nav-btn_active" type="button" data-tab="#slide-1">
              <img src="${img.stringValue}" />
          </button>
          <button class="tabs__nav-btn" type="button" data-tab="#slide-2">
              <img src="${subImg1.stringValue}" />
          </button>
          <button class="tabs__nav-btn" type="button" data-tab="#slide-3">
              <img src="${subImg2.stringValue}" />
          </button>
        `;

        clothersWrapperItem.innerHTML = `
          <div class="main-img__slide swiper-slide tabs__item tabs__item_active" id="slide-1">
            <img src="${img.stringValue}" />
          </div>
          <div class="main-img__slide swiper-slide tabs__item" id="slide-2">
            <img src="${subImg1.stringValue}" />
          </div>
          <div class="main-img__slide swiper-slide tabs__item" id="slide-3">
            <img src="${subImg2.stringValue}" />
          </div>
        `;
      } else if (img?.stringValue != null) {
        clothersWrapperTabs.innerHTML = `
          <button class="tabs__nav-btn tabs__nav-btn_active" type="button" data-tab="#slide-1">
            <img src="${img.stringValue}" />
          </button>
        `;

        clothersWrapperItem.innerHTML = `
          <div class="main-img__slide swiper-slide tabs__item tabs__item_active" id="slide-1">
            <img src="${img.stringValue}" />
          </div>
        `;
      }
    }
  }
}
