import { OneNew } from '../components/interface';
import { Skeleton } from '../components/skeleton';
import { getElement, renderElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

const newContainer = getElement('.new-info');

export class NewInfo {
  newInfo: OneNew | null;

  constructor() {
    this.newInfo = null;

    this.initInfo().then(() => Loader.stop('new-info'));
  }

  async initInfo() {
    const docId = this.getDocumentIdFromURL();
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/blog/${docId}`;

    const response = await fetchComposable<{ fields: OneNew }>(firestoreApiUrl);
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
      const newTitle1 = renderElement('h3', 'new-info__title');
      newTitle1.textContent = this.newInfo.textTitle.stringValue;

      const newText1 = renderElement('p', 'new-info__text');
      newText1.textContent = this.newInfo.textFirst.stringValue;

      const newImg = renderElement('div', 'new-info__img');
      newImg.innerHTML = `
        <picture>
          <source srcset="${this.newInfo.newImgWebP.stringValue}" type="image/webp" />
          <img src="${this.newInfo.newImg.stringValue}"/>
        </picture>
      `;

      const newTitle2 = renderElement('h3', 'new-info__title');
      newTitle2.textContent = this.newInfo.textTitle.stringValue;

      const newText2 = renderElement('p', 'new-info__text');
      newText2.textContent = this.newInfo.textSecond.stringValue;

      newContainer.appendChild(newTitle1);
      newContainer.appendChild(newText1);
      newContainer.appendChild(newImg);
      newContainer.appendChild(newTitle2);
      newContainer.appendChild(newText2);
    }
  }
}
