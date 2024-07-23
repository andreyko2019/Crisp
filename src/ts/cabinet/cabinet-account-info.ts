import { updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { UserData } from '../components/interface';
import { getElement, getElements } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { auth } from '../modules/firebase';

export class AccInfo {
  userData: UserData | undefined;
  uid: string | undefined;

  constructor() {
    this.uid = this.getCookie('UID');
    this.init();
  }

  init() {
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
          this.uid = doc.document.name.split('/').pop();
          this.updateUi();
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
        window.location.reload();
      });
    }

    const changeEmailCheckbox = getElement('#changeEmailCheckbox') as HTMLInputElement;
    const changePasswordCheckbox = getElement('#changePasswordCheckbox') as HTMLInputElement;
    const emailField = getElement('#emailField') as HTMLDivElement;
    const passwordField = getElement('#passwordField') as HTMLDivElement;
    const currentPasswordEmailField = getElement('#currentPasswordEmail')?.parentElement?.parentElement as HTMLDivElement;
    const currentPasswordField = getElement('#currentPassword')?.parentElement?.parentElement as HTMLDivElement;

    if (changeEmailCheckbox) {
      changeEmailCheckbox.addEventListener('change', () => {
        emailField.style.display = changeEmailCheckbox.checked ? 'flex' : 'none';
        currentPasswordEmailField.style.display = changeEmailCheckbox.checked ? 'flex' : 'none';
      });
    }

    if (changePasswordCheckbox) {
      changePasswordCheckbox.addEventListener('change', () => {
        passwordField.style.display = changePasswordCheckbox.checked ? 'flex' : 'none';
        currentPasswordField.style.display = changePasswordCheckbox.checked ? 'flex' : 'none';
      });
    }
  }

  async updateData() {
    const nameInpElem = getElement('#name') as HTMLInputElement;
    const surnameInpElem = getElement('#surname') as HTMLInputElement;
    const changeEmailElem = getElement('#changeEmailCheckbox') as HTMLInputElement;
    const newEmailElem = getElement('#email') as HTMLInputElement;
    const changePasswordElem = getElement('#changePasswordCheckbox') as HTMLInputElement;
    const newPasswordElem = getElement('#password') as HTMLInputElement;
    const currentPasswordEmailElem = getElement('#currentPasswordEmail') as HTMLInputElement;
    const currentPasswordElem = getElement('#currentPassword') as HTMLInputElement;

    if (!nameInpElem || !surnameInpElem || !changeEmailElem || !newEmailElem || !changePasswordElem || !newPasswordElem || !currentPasswordElem || !currentPasswordEmailElem) {
      console.error('One or more input elements are not found in the DOM');
      return;
    }

    const nameInp = nameInpElem.value;
    const surnameInp = surnameInpElem.value;
    const changeEmail = changeEmailElem.checked;
    const newEmail = newEmailElem.value;
    const changePassword = changePasswordElem.checked;
    const newPassword = newPasswordElem.value;
    const currentPasswordEmail = currentPasswordEmailElem.value;
    const currentPassword = currentPasswordElem.value;

    if (!this.uid) {
      console.error('UID not found');
      return;
    }

    const firebaseConfig = {
      projectId: 'crisp-b06bf',
    };

    const documentPath = `users/${this.uid}`;
    const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/${documentPath}?updateMask.fieldPaths=name&updateMask.fieldPaths=surname${changeEmail ? '&updateMask.fieldPaths=email' : ''}`;

    let requestBody: { fields: { name: { stringValue: string }; surname: { stringValue: string }; email?: { stringValue: string } } } = {
      fields: {
        name: { stringValue: nameInp },
        surname: { stringValue: surnameInp },
      },
    };

    if (changeEmail) {
      requestBody.fields.email = { stringValue: newEmail };
    }

    try {
      const response = await fetchComposable<{ updateTime: string }, typeof requestBody>(url, {
        method: 'PATCH',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error updating data:', response.error);
        return;
      }

      if (changeEmail) {
        await this.updateEmail(newEmail, currentPasswordEmail);
      }

      if (changePassword) {
        await this.updatePassword(newPassword, currentPassword);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }

  async updateEmail(newEmail: string, currentPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      try {
        await this.reauthenticateUser(currentPassword);

        await updateEmail(user, newEmail);
      } catch (error) {
        console.error('Error updating email:', error);
      }
    }
  }

  async reauthenticateUser(password: string): Promise<void> {
    const user = auth.currentUser;
    if (user && user.email) {
      const credential = EmailAuthProvider.credential(user.email, password);
      try {
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        console.error('Error re-authenticating user:', error);
      }
    }
  }

  async updatePassword(newPassword: string, currentPassword: string): Promise<void> {
    const user = auth.currentUser;
    if (user) {
      try {
        await this.reauthenticateUser(currentPassword);

        await updatePassword(user, newPassword);
      } catch (error) {
        console.error('Error updating password:', error);
      }
    }
  }
}
