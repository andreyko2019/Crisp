import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../modules/firebase';
import { getElement } from '../composables/useCallDom';
import { fetchComposable } from '../composables/useFetch';
import { UserUid } from '../components/interface';

export class GoAcc {
  user: { id: string; data: UserUid }[];

  constructor() {
    this.user = [];
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
      const firebaseConfig = {
        projectId: 'crisp-b06bf',
      };

      const requestBody = {
        structuredQuery: {
          from: [{ collectionId: 'users' }],
        },
      };

      const url = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery`;

      const response = await fetchComposable<{ document: { name: string; fields: UserUid } }[], typeof requestBody>(url, {
        method: 'POST',
        body: requestBody,
      });

      if (response.error) {
        console.error('Error fetching data:', response.error);
        return;
      }

      if (response.data) {
        response.data.forEach((doc) => {
          if (doc.document && doc.document.fields) {
            const docId = doc.document.name.split('/').pop() || '';
            this.user.push({ id: docId, data: doc.document.fields });
          }
        });

        try {
          const user = await signInWithEmailAndPassword(auth, email, password);
          const userUid = user.user.uid;

          const userExist = this.user.find((item) => item.data.uid.stringValue === userUid);

          if (userExist) {
            document.cookie = `UID=${user.user.uid}`;
            window.location.href = '/cabinet#account-dashboard';
            console.log('User signed in and cookie set');
          } else {
            console.log('User not found in database');
          }
        } catch (error) {
          console.error('Error signing in:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
}
