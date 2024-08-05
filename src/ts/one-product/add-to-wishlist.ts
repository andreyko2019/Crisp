import { OneDressBag, UserData } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const saveBtn = getElement('.bag__save');
const redHoverColor = '#eb5757';

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
    this.conectUserDb();
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        this.addToWishlistDb();
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
      window.location.href = '/sign-in';
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
      this.checkWishlistStatus();
    }
  }

  async checkWishlistStatus() {
    if (!this.currentUser || !this.currentClother) {
      console.error('Current user or clothing item is not defined');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const userDocId = this.currentUser.id;
    const clothingDocId = this.currentClother.id;

    const urlGet = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${userDocId}`;

    const responseGet = await fetchComposable<{ fields: UserData }, null>(urlGet, {
      method: 'GET',
    });

    if (responseGet.error || !responseGet.data) {
      console.error('Error fetching current wishlist:', responseGet.error);
      return;
    }

    const currentWishlist = responseGet.data.fields.wishlist?.arrayValue?.values || [];

    const isAlreadyInWishlist = currentWishlist.some((item) => item.stringValue === clothingDocId);

    if (isAlreadyInWishlist) {
      if (saveBtn) {
        saveBtn.style.backgroundColor = redHoverColor;
        saveBtn.style.borderColor = redHoverColor;
        saveBtn.style.pointerEvents = 'none';
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

    const userDocId = this.currentUser.id;
    const clothingDocId = this.currentClother.id;

    const urlGet = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${userDocId}`;

    const responseGet = await fetchComposable<{ fields: UserData }, null>(urlGet, {
      method: 'GET',
    });

    if (responseGet.error || !responseGet.data) {
      console.error('Error fetching current wishlist:', responseGet.error);
      return;
    }

    const currentWishlist = responseGet.data.fields.wishlist?.arrayValue?.values || [];

    const isAlreadyInWishlist = currentWishlist.some((item) => item.stringValue === clothingDocId);

    if (isAlreadyInWishlist) {
      this.checkWishlistStatus();
      return;
    }

    const updatedWishlist = [...currentWishlist, { stringValue: clothingDocId }];

    const urlPatch = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users/${userDocId}?updateMask.fieldPaths=wishlist`;

    const requestBody = {
      fields: {
        wishlist: {
          arrayValue: {
            values: updatedWishlist,
          },
        },
      },
    };

    try {
      const responsePatch = await fetchComposable<null, typeof requestBody>(urlPatch, {
        method: 'PATCH',
        body: requestBody,
      });

      if (responsePatch.error) {
        console.error('Error updating wishlist:', responsePatch.error);
        return;
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  }
}
