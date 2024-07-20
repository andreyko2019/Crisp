import { OneDressBag, UserData } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const saveBtn = getElement('.bag__save');

export class AddToWishList {
  uid: string | undefined;
  currentUser: { id: string; data: UserData } | null;
  currentClother: { id: string; data: OneDressBag } | null;

  constructor() {
    this.currentUser = null;
    this.uid = this.getCookie('UID');
    this.currentClother = null;

    this.init();
  }

  init() {
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.conectUserDb();
      });
    }
  }

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  async conectUserDb() {
    if (!this.uid) {
      console.error('UID not found');
      window.location.href = '/Crisp/sign-in.html';
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const requestBody = {
      structuredQuery: {
        from: [{ collectionId: 'users' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'uid' },
            op: 'EQUAL',
            value: { stringValue: this.uid },
          },
        },
      },
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

    try {
      const response = await fetchComposable<{ document: { name: string; fields: UserData } }[], typeof requestBody>(url, {
        method: 'POST',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error fetching data:', response.error);
        return;
      }

      if (response.data && response.data.length > 0) {
        const doc = response.data[0];
        if (doc.document && doc.document.fields) {
          const docId = doc.document.name.split('/').pop() || '';
          this.currentUser = { id: docId, data: doc.document.fields };
        }
        console.log(this.currentUser);
        this.getCurrentClotherDB();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  private getDocumentIdFromURL(): string | null {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async getCurrentClotherDB() {
    if (this.currentUser?.data.wishlistID) {
      const docId = this.getDocumentIdFromURL();

      if (!docId) {
        console.error('Document ID not found in URL');
        return;
      }

      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/clothers/${docId}`;

      const response = await fetchComposable<{ name: string; fields: OneDressBag }, null>(url, {
        method: 'GET',
      });

      if (response.error) {
        console.error('Error fetching document:', response.error);
        return;
      }

      if (response.data) {
        this.currentClother = {
          id: docId,
          data: response.data.fields,
        };
        console.log(this.currentClother);
        this.addToWishlistDb();
      }
    }
  }

  async addToWishlistDb() {
    if (!this.currentUser || !this.currentClother) {
      console.error('Current user or clothing item is not defined');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/all-wishlist/${this.currentUser.data.shoppingAddress?.stringValue}/wishlist/${this.currentClother.id}`;

    console.log(url);

    const requestBody = {
      fields: {
        name: this.currentClother.data.name,
        cost: this.currentClother.data.cost,
        img: this.currentClother.data.img,
        imgWebP: this.currentClother.data.imgWebP,
      },
    };

    try {
      const response = await fetchComposable<{ name: string }, typeof requestBody>(url, {
        method: 'PATCH',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error adding document:', response.error);
        return;
      }

      if (response.data) {
        console.log('Document written with ID:', response.data.name);
      }
    } catch (error) {
      console.error('Error adding document:', error);
    }
  }
}
