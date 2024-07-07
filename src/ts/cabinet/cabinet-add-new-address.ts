import { Shopping, UserData } from '../components/interface';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

const addBtn = getElement('.add-address__save');

export class AddAddress {
  userData: UserData | null;
  private newAddressDb: Shopping | null;
  uid: string | undefined;

  constructor() {
    this.newAddressDb = null;
    this.userData = null;
    this.uid = this.getCookie('UID');

    this.init();
  }

  init() {
    addBtn?.addEventListener('click', () => {
      this.fieldsDb();
      this.conectDb();
    });
  }

  fieldsDb() {
    const company = (getElement('#company') as HTMLInputElement).value;
    const phone = (getElement('#phone') as HTMLInputElement).value;
    const fax = (getElement('#fax') as HTMLInputElement).value;
    const street = (getElement('#street') as HTMLInputElement).value;
    const country = getElement('#country .drop-down__select')?.innerText;
    const state = getElement('#state .drop-down__select')?.innerText;
    const zip = (getElement('#zip') as HTMLInputElement).value;

    this.newAddressDb = {
      country: { stringValue: country || '' },
      city: { stringValue: state || '' },
      street: { stringValue: street },
      zip: { stringValue: zip },
      phone: { stringValue: phone },
    };

    if (company) {
      this.newAddressDb.company = { stringValue: company };
    }
    if (fax) {
      this.newAddressDb.fax = { stringValue: fax };
    }

    console.log(this.newAddressDb);
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
          this.userData = doc.document.fields;
          this.uid = doc.document.name.split('/').pop(); // Extract document ID from the document name
        }
        console.log(this.userData);
        this.addToDb();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async addToDb() {
    if (this.userData && this.userData.shoppingAddress?.stringValue) {
      const shopping = this.userData.shoppingAddress.stringValue;

      console.log(shopping);

      if (!this.uid) {
        console.error('UID not found');
        return;
      }

      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/shopping-address/${shopping}/allUserAddress`;

      if (this.newAddressDb) {
        const requestBody = {
          fields: {
            country: this.newAddressDb.country,
            city: this.newAddressDb.city,
            street: this.newAddressDb.street,
            zip: this.newAddressDb.zip,
            phone: this.newAddressDb.phone,
            ...(this.newAddressDb.company && { company: this.newAddressDb.company }),
            ...(this.newAddressDb.fax && { fax: this.newAddressDb.fax }),
          },
        };

        try {
          const response = await fetchComposable<{ name: string }, typeof requestBody>(url, {
            method: 'POST',
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
          console.error('Error adding address:', error);
        }
      }
    }
  }
}
