import { getElement, getElements } from '../composables/useCallDom';
import { OneDress } from './interface';

const search = getElements('.search');
const searchBtn = getElements('.search svg');
const searcInput = getElements('.search input');

export class Search {
  prodArr: OneDress[];

  constructor() {
    this.prodArr = [];

    this.init();
  }

  init() {
    this.openSearch();
  }

  private openSearch() {
    search.forEach((item) => {
      if (window.innerWidth < 1024 && item.classList.contains('mob')) {
        item.querySelector('svg')?.addEventListener('click', () => {
          item.classList.toggle('active');
        });
      }
    });
  }
}
