import { OneNew } from '../components/interface';
import { Skeleton } from '../components/skeleton';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const newContainer = getElement('.new-info');

export class NewInfo {
  newInfo: OneNew | null;

  constructor() {
    this.newInfo = null;

    this.initInfo();
  }

  async initInfo() {
    const docId = this.getDocumentIdFromURL();
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/blog/${docId}`;

    const response = await fetchComposable<{ fields: OneNew }>(firestoreApiUrl); // Исправлено здесь
    if (response.error) {
      console.error('Ошибка при загрузке данных:', response.error);
      return;
    }

    if (response.data) {
      this.newInfo = response.data.fields;
      this.renderNew();

      new Skeleton();
    }
  }

  getDocumentIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  renderNew() {
    if (newContainer && this.newInfo != null) {
      newContainer.innerHTML = '';
      newContainer.insertAdjacentHTML(
        'beforeend',
        `
        <h3 class="new-info__title">${this.newInfo.textTitle.stringValue}</h3>
        <p class="new-info__text">
            ${this.newInfo.textFirst.stringValue}
        </p>
        <div class="new-info__img">
            <picture>
                <source srcset="${this.newInfo.newImgWebP.stringValue}" type="image/webp" />
                <img src="${this.newInfo.newImg.stringValue}"/>
            </picture>
        </div>
        <h3 class="new-info__title">${this.newInfo.textTitle.stringValue}</h3>
        <p class="new-info__text">
            ${this.newInfo.textSecond.stringValue}
        </p>              
        `
      );
    }
  }
}
