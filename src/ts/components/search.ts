import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { OneDress } from './interface';

const search = getElements('.search');
const searchBtn = getElements('.search svg');
const searcInput = getElements('.search input');

export class Search {
  prodArr: { id: string; data: OneDress }[];

  constructor() {
    this.prodArr = [];

    this.init();
  }

  init() {
    this.openSearch();
    this.getData();
    this.filter();
  }

  private openSearch() {
    search.forEach((item) => {
      if (window.innerWidth < 1024 && item.classList.contains('mob')) {
        item.querySelector('svg')?.addEventListener('click', () => {
          item.classList.toggle('active');
          getElement('.burger-btn')?.classList.toggle('hidden');
          getElement('.header__logo')?.classList.toggle('hidden');
          getElement('.header__search-and-bag .buy__bag')?.classList.toggle('hidden');
        });
      } else if (!item.classList.contains('mob')) {
        item.addEventListener('click', () => {
          item.classList.toggle('active');
        });
      }
    });
  }

  private async getData() {
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

    const response = await fetchComposable<{ document: { name: string; fields: OneDress } }[], typeof requestBody>(url, {
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
        this.prodArr.push({ id: docId, data: doc.document.fields });
      });
      console.log(this.prodArr);
    }
  }

  private addPopUp() {
    const popUp = renderElement('div', ['search__popup', 'pop-up']);
  }

  private filter() {}
}
