import { Billing, Shopping, UserData } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

export class Dashboard {
  userData: UserData | undefined;
  uid: string | undefined;

  constructor() {
    this.uid = this.getCookie('UID');

    this.init();
  }

  init() {
    console.log(this.uid);
    this.conectDb();
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
    this.contactInfo();
    this.billing();
    this.shoppingAdress();
  }

  contactInfo() {
    if (!this.userData) return;

    const name = getElement('.full-name');
    if (name) {
      name.innerHTML = `${this.userData.name.stringValue} ${this.userData.surname.stringValue}`;
    }

    const mail = getElement('.email');
    if (mail) {
      mail.innerHTML = this.userData.email.stringValue;
    }
  }

  async billing() {
    if (this.userData && this.userData.billing?.stringValue) {
      const billing = this.userData.billing.stringValue;
      let billingData = null;
      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/billing/${billing}`;

      const response = await fetchComposable<{ fields: Billing }>(firestoreApiUrl); // Исправлено здесь
      if (response.error) {
        console.error('Ошибка при загрузке данных:', response.error);
        return;
      }

      if (response.data) {
        billingData = response.data.fields;

        const billingField = getElement('.billing-address');
        if (billingField) {
          billingField.innerHTML = `${billingData.country.stringValue}, ${billingData.city.stringValue}, ${billingData.street.stringValue} street, ${billingData.house.stringValue}`;
        }
      }
    }
  }

  async shoppingAdress() {
    if (this.userData && this.userData.shoppingAddress?.stringValue) {
      const shopping = this.userData.shoppingAddress.stringValue;
      let shoppingData = null;
      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const firestoreApiUrl = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/shopping-address/${shopping}`;

      const response = await fetchComposable<{ fields: Shopping }>(firestoreApiUrl); // Исправлено здесь
      if (response.error) {
        console.error('Ошибка при загрузке данных:', response.error);
        return;
      }

      if (response.data) {
        shoppingData = response.data.fields;

        const shoppingField = getElement('.shopping-address');
        if (shoppingField) {
          shoppingField.innerHTML = `${shoppingData.phone.stringValue}<br>${shoppingData.country.stringValue}, ${shoppingData.city.stringValue}, ${shoppingData.street.stringValue} street, ${shoppingData.house.stringValue}, ${shoppingData.zip.stringValue}`;
        }
      }
    }
  }
}
