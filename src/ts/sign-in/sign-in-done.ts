import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../modules/firebase';
import { getElement } from '../composables/useCallDom';
import { collection, getDocs } from 'firebase/firestore';

interface User {
  id: string;
  uid: string;
}

export class GoAcc {
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
      const userData = await getDocs(collection(db, 'users'));
      const allUsers: User[] = [];

      userData.forEach((doc) => {
        const data = doc.data();
        allUsers.push({
          id: doc.id,
          uid: data.uid,
        });
      });

      try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        const userUid = user.user.uid;
        const userExist = allUsers.find((item) => item.uid === userUid);

        if (userExist) {
          document.cookie = `UID=${user.user.uid}`;
          console.log('User signed in and cookie set');
        } else {
          console.log('User not found in database');
        }
      } catch (error) {
        console.error('There was an error signing in:', error);
      }
    } catch (error) {
      console.error('There was an error fetching user data:', error);
    }
  }
}
