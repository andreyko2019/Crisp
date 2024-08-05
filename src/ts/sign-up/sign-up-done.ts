import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../modules/firebase';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';

export class CreateAcc {
  constructor() {
    this.init();
  }

  async init() {
    const emailElement = getElement('#email') as HTMLInputElement;
    const passwordElement = getElement('#password') as HTMLInputElement;

    if (!emailElement || !passwordElement) {
      console.error('Email or Password input element not found', {
        emailElement,
        passwordElement,
      });
      return;
    }

    const email = emailElement.value;
    const password = passwordElement.value;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const name = (getElement('#name-sign-up') as HTMLInputElement).value;
      const surname = (getElement('#surname-sign-up') as HTMLInputElement).value;

      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents/users`;
      const requestBody = {
        fields: {
          uid: { stringValue: user.uid },
          name: { stringValue: name },
          surname: { stringValue: surname },
          email: { stringValue: email },
        },
      };

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

      document.cookie = `UID=${user.uid}`;
      window.location.href = '/cabinet#account-dashboard';
    } catch (error) {
      console.log('There was an error:', error);
    }
  }
}
