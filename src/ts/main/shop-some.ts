import { ShopFilters } from '../components/interface';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { LoadMoreComponent } from '../components/btnLoad';
import { Loader } from '../modules/stop-preload';

const clothersWrapper = getElement('.shop-some__items');

export class ShopSome {
  
  shopDb: { id: string; data: ShopFilters }[];

  constructor() {
    this.shopDb = [];

    this.loadCards().then(() => Loader.stop('shop-some__items'));
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
        this.shopDb.push({ id: docId, data: doc.document.fields });
      });
      console.log(this.shopDb);
      this.renderCard();
      new LoadMoreComponent('.shop-some__items', '.shop-some__card', '.shop-some__load', 8, 8);
    }
  }

  renderCard() {
    if (clothersWrapper) {
      this.shopDb.forEach((item) => {
        const card = renderElement('a', ['card', 'shop-some__card', item.id]) as HTMLAnchorElement;
        card.href = `one-product.html?id=${item.id}`;
        if (item.data.sale.booleanValue === true) {
          card.classList.add('sale');
        }

        const img = renderElement('div', 'card__img');
        img.innerHTML += `
            <picture>
              <source srcset=${item.data.imgWebP.stringValue} type="image/webp" />
              <img src=${item.data.img.stringValue} />
            </picture>
        `;
        if (item.data.sale.booleanValue === true) {
          img.innerHTML += `
            <div class="card__sale">
              <p>-30%</p>
            </div>
          `;
        }

        const info = renderElement('div', 'card__info');

        const category = renderElement('p', 'card__category');
        category.innerText = item.data.category.stringValue;

        const title = renderElement('h3', 'card__title');
        title.innerText = item.data.name.stringValue;

        const price = renderElement('p', 'card__price');
        if (item.data.sale.booleanValue === false) {
          price.innerText = item.data.cost.stringValue;
        } else {
          price.innerHTML = `${item.data.costNew.stringValue} <span>${item.data.cost.stringValue}</span>`;
        }

        info.appendChild(category);
        info.appendChild(title);
        info.appendChild(price);

        card.appendChild(img);
        card.appendChild(info);

        clothersWrapper.appendChild(card);
      });

      const btnLoad = renderElement('button', ['btn', 'shop-some__load']);
      btnLoad.textContent = 'Load more';

      clothersWrapper.appendChild(btnLoad);
    }
  }
}
