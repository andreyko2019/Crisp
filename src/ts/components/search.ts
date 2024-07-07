import { getElement, getElements, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { OneDressBag } from './interface';

const search = getElements('.search');
const searchBtn = getElements('.search svg');

export class Search {
  prodArr: { id: string; data: OneDressBag }[];

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
          console.log('click');
          getElement('.burger-btn')?.classList.toggle('hidden');
          getElement('.header__logo')?.classList.toggle('hidden');
          getElement('.buy__bag')?.classList.toggle('hidden');
          this.addPopUp(item);
          this.getData();
          this.getFilteredItems();
          item.querySelector('::before')?.addEventListener('click', () => {
            item.classList.remove('active');
            getElement('.burger-btn')?.classList.remove('hidden');
            getElement('.header__logo')?.classList.remove('hidden');
            getElement('.buy__bag')?.classList.remove('hidden');
          });
        });
      } else if (!item.classList.contains('mob')) {
        item.addEventListener('click', () => {
          item.classList.toggle('active');
          this.addPopUp(item);
          this.getData();
          this.getFilteredItems();
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

    const response = await fetchComposable<{ document: { name: string; fields: OneDressBag } }[], typeof requestBody>(url, {
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
      const container = getElement('.search__popup.pop-up');
      if (container) {
        this.renderCards(container);
      }
    }
  }

  private addPopUp(item: HTMLElement) {
    const popup = getElement('.search__popup.pop-up');
    if (!popup) {
      const popUp = renderElement('div', ['search__popup', 'pop-up', 'active']);
      item.appendChild(popUp);
    }
    popup?.classList.toggle('active');
  }

  private renderCards(container: HTMLElement) {
    this.prodArr.forEach((item) => {
      const card = renderElement('a', ['card', item.id]) as HTMLAnchorElement;
      card.href = `one-product.html?id=${item.id}`;

      const img = renderElement('div', 'card__img');
      img.innerHTML += `
            <picture>
              <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
              <img src=${item.data.img.stringValue} />
            </picture>
      `;

      const info = renderElement('div', 'card__info');

      const title = renderElement('h3', 'card__title');
      title.innerText = item.data.name.stringValue;

      const price = renderElement('p', 'card__price');
      price.innerText = item.data.cost.stringValue;

      info.appendChild(title);
      info.appendChild(price);

      card.appendChild(img);
      card.appendChild(info);

      container.appendChild(card);
    });
  }

  private filter(word: string, allClother: { id: string; data: OneDressBag }[]) {
    return allClother.filter((clother) => {
      const regexp = new RegExp(word, 'gi');
      return clother.data.name.stringValue.match(regexp);
    });
  }

  private getFilteredItems() {
    search.forEach((item) => {
      if (item.classList.contains('active')) {
        const input = item.querySelector('input');
        console.log(input);
        input?.addEventListener('input', () => {
          const filterArr = this.filter(input.value, this.prodArr);
          const container = getElement('.search__popup.pop-up');
          if (container) {
            this.clearContainer(container);
            this.renderFilteredCards(container, filterArr);
          }
        });
      }
    });
  }

  private clearContainer(container: HTMLElement) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  private renderFilteredCards(container: HTMLElement, filteredArr: { id: string; data: OneDressBag }[]) {
    filteredArr.forEach((item) => {
      const card = renderElement('a', ['card', item.id]) as HTMLAnchorElement;
      card.href = `one-product.html?id=${item.id}`;

      const img = renderElement('div', 'card__img');
      img.innerHTML += `
            <picture>
              <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
              <img src=${item.data.img.stringValue} />
            </picture>
      `;

      const info = renderElement('div', 'card__info');

      const title = renderElement('h3', 'card__title');
      title.innerText = item.data.name.stringValue;

      const price = renderElement('p', 'card__price');
      price.innerText = item.data.cost.stringValue;

      info.appendChild(title);
      info.appendChild(price);

      card.appendChild(img);
      card.appendChild(info);

      container.appendChild(card);
    });
  }
}
