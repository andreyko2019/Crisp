import { News } from '../components/interface';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

const newsWrapper = getElement('.blog__cards');

export class Blog {
  newsDb: { id: string; data: News }[];

  constructor() {
    this.newsDb = [];

    this.loadCards().then(() => Loader.stop('blog__cards'));
  }

  async loadCards() {
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody: { structuredQuery: { from: { collectionId: string }[] } } = {
      structuredQuery: {
        from: [
          {
            collectionId: 'blog',
          },
        ],
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    const response = await fetchComposable<{ document: { name: string; fields: News } }[], typeof requestBody>(url, {
      method: 'POST',
      body: requestBody,
    });

    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      response.data.forEach((doc) => {
        if (doc.document && doc.document.fields) {
          const docId = doc.document.name.split('/').pop() || '';
          this.newsDb.push({ id: docId, data: doc.document.fields });
        }
      });
      this.renderCard();
    }
  }

  renderCard() {
    this.newsDb.forEach((item) => {
      if (newsWrapper) {
        const oneNew = renderElement('a', ['blog__card', 'new', item.id]) as HTMLAnchorElement;
        oneNew.href = `new.html?id=${item.id}`;

        const category = renderElement('p', 'new__category');
        category.innerText = item.data.type?.stringValue;

        const title = renderElement('p', 'new__title');
        title.innerText = item.data.title?.stringValue;

        const info = renderElement('p', 'new__info');
        info.innerText = item.data.shortInfo?.stringValue;

        const dateAuth = renderElement('p', 'new__date-and-auth');
        dateAuth.innerHTML = `
          <span class="date">${item.data.date?.stringValue}</span>
          by
          <span class="author">${item.data.author?.stringValue}</span>`;

        oneNew.appendChild(category);
        oneNew.appendChild(title);
        oneNew.appendChild(info);
        oneNew.appendChild(dateAuth);

        newsWrapper.appendChild(oneNew);
      }
    });
  }
}
