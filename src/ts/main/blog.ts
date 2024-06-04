import { News } from '../components/interface';
import { getElement } from '../composables/callDom';
import { fetchComposable } from '../composables/useFetch';

const newsWrapper = getElement('.blog__cards');

export class Blog {
  newsDb: { id: string; data: News }[];

  constructor() {
    this.newsDb = [];
    this.loadCards();
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
      console.log(this.newsDb);
      this.renderCard();
    }
  }

  renderCard() {
    this.newsDb.forEach((item) => {
      if (newsWrapper) {
        newsWrapper.insertAdjacentHTML(
          'afterbegin',
          `
            <a class="blog__card new ${item.id}" href="new.html?id=${item.id}">
                <p class="new__category">${item.data.type?.stringValue}</p>
                <p class="new__title">${item.data.title?.stringValue}</p>
                <p class="new__info">${item.data.shortInfo?.stringValue}</p>
                <div class="new__date-and-auth">
                <p class="date">${item.data.date?.stringValue}</p>
                by
                <p class="author">${item.data.author?.stringValue}</p>
                </div>
            </a>
            `
        );
      }
    });
  }
}
