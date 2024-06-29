import { UserData } from '../components/interface';
import { getElement, getElements } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

export class AccInfo {
  userData: UserData | undefined;
  uid: string | undefined;

  constructor() {
    this.uid = this.getCookie('UID');

    this.init();
  }

  init() {
    console.log(this.uid);
    this.conectDb();
    this.setupEventListeners();
  }

  getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  }

  async conectDb() {
    if (!this.uid) {
      console.error('UID not found');
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

    const response = await fetchComposable<{ document: { fields: UserData } }[], typeof requestBody>(url, {
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
        this.userData = doc.document.fields;
        console.log(this.userData);
        this.updateUi();
      }
    }
  }

  updateUi() {
    const allInp = getElements('.form__item-input') as NodeListOf<HTMLInputElement>;
    if (allInp) {
      allInp.forEach((inp) => {
        if (inp.id === 'name' && this.userData) {
          inp.value = this.userData.name.stringValue;
        } else if (inp.id === 'surname' && this.userData) {
          inp.value = this.userData.surname.stringValue;
        }
      });
    }
  }

  setupEventListeners() {
    const saveButton = getElement('.form__button .save');
    if (saveButton) {
      saveButton.addEventListener('click', (event) => {
        event.preventDefault();
        this.updateData();
      });
    }
  }

  async updateData() {
    const nameInp = (getElement('#name') as HTMLInputElement).value;
    const surnameInp = (getElement('#surname') as HTMLInputElement).value;

    if (!this.uid) {
      console.error('UID not found');
      return;
    }

    console.log('Updating data for UID:', this.uid);
    console.log('New name:', nameInp);
    console.log('New surname:', surnameInp);

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const documentPath = `users/${this.uid}`;
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${documentPath}?updateMask.fieldPaths=name&updateMask.fieldPaths=surname`;

    const requestBody = {
      fields: {
        name: { stringValue: nameInp },
        surname: { stringValue: surnameInp },
      },
    };

    console.log('Request URL:', url);
    console.log('Request body:', requestBody);

    const response = await fetchComposable<any, typeof requestBody>(url, {
      method: 'PATCH',
      body: requestBody,
    });

    if (response.error) {
      console.error('Error updating data:', response.error);
      return;
    }

    console.log('Data updated successfully:', response.data);
  }
}
