import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { Loader } from '../modules/stop-preload';

export class NewBaner {
  constructor() {
    this.initBaner().then(() => Loader.stop('new-baner'));
  }

  async initBaner() {
    const newTitle = getElement('.new-baner h2');
    const back = getElement('.new-baner__content') as HTMLElement;
    const docId = this.getDocumentIdFromURL();
    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/blog/${docId}`;

    const response = await fetchComposable<{ fields: { title: { stringValue: string }; banerImg: { stringValue: string } } }>(firestoreApiUrl);

    if (response.error) {
      console.error('Ошибка при получении документа:', response.error.message);
      return;
    }

    if (response.data) {
      const title = response.data.fields.title.stringValue;
      const bg = response.data.fields.banerImg.stringValue;
      console.log(title);
      if (newTitle && back) {
        newTitle.textContent = title;
        back.style.backgroundImage = `url(${bg})`;
      }
    }
  }

  getDocumentIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }
}
