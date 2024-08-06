import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import { getElement, getElements, renderElement } from '../composables/useCallDom';
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
      this.renderSlides();
      this.initSwiper();
      Loader.stop('main-img__slide');
      Loader.stop('tabs__nav-btn');
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
        const tab1 = renderElement('button', ['tabs__nav-btn', 'tabs__nav-btn_active', 'skeleton']) as HTMLButtonElement;
        tab1.type = 'button';
        tab1.dataset.tab = '#slide-1';
        tab1.innerHTML = `
          <img src="${img.stringValue}" alt="img">
        `;

        const tab2 = renderElement('button', ['tabs__nav-btn', 'skeleton']) as HTMLButtonElement;
        tab2.type = 'button';
        tab2.dataset.tab = '#slide-2';
        tab2.innerHTML = `
          <img src="${subImg1.stringValue}" alt="img">
        `;

        const tab3 = renderElement('button', ['tabs__nav-btn', 'skeleton']) as HTMLButtonElement;
        tab3.type = 'button';
        tab3.dataset.tab = '#slide-3';
        tab3.innerHTML = `
          <img src="${subImg2.stringValue}" alt="img">
        `;

        clothersWrapperTabs.appendChild(tab1);
        clothersWrapperTabs.appendChild(tab2);
        clothersWrapperTabs.appendChild(tab3);

        const slide1 = renderElement('div', ['main-img__slide', 'swiper-slide', 'tabs__item', 'tabs__item_active', 'skeleton']);
        slide1.id = 'slide-1';
        slide1.innerHTML = `
          <img src="${img.stringValue}" alt="img">
        `;

        const slide2 = renderElement('div', ['main-img__slide', 'swiper-slide', 'tabs__item', 'skeleton']);
        slide2.id = 'slide-2';
        slide2.innerHTML = `
          <img src="${subImg1.stringValue}" alt="img">
        `;

        const slide3 = renderElement('div', ['main-img__slide', 'swiper-slide', 'tabs__item', 'skeleton']);
        slide3.id = 'slide-3';
        slide3.innerHTML = `
          <img src="${subImg2.stringValue}" alt="img">
        `;

        clothersWrapperItem.appendChild(slide1);
        clothersWrapperItem.appendChild(slide2);
        clothersWrapperItem.appendChild(slide3);
      } else if (img?.stringValue != null) {
        const tab1 = renderElement('button', ['tabs__nav-btn', 'tabs__nav-btn_active', 'skeleton']) as HTMLButtonElement;
        tab1.type = 'button';
        tab1.dataset.tab = '#slide-1';
        tab1.innerHTML = `
          <img src="${img.stringValue}" alt="img">
        `;

        clothersWrapperTabs.appendChild(tab1);

        const slide1 = renderElement('div', ['main-img__slide', 'swiper-slide', 'tabs__item', 'tabs__item_active']);
        slide1.id = 'slide-1';
        slide1.innerHTML = `
          <img src="${img.stringValue}" alt="img">
        `;

        clothersWrapperItem.appendChild(slide1);
      }
    }
  }
}
