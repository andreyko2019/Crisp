import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../modules/firebase';
import { getElement } from '../composables/useCallDom';
import { addDoc, collection } from 'firebase/firestore';

export class CreateAcc {
  constructor() {
    this.init();
  }

  async init() {
    const email = (getElement('#email') as HTMLInputElement).value;
    const password = (getElement('#password') as HTMLInputElement).value;
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      const userAdd = await addDoc(collection(db, 'users'), {
        uid: user.user.uid,
        name: (getElement('#name') as HTMLInputElement).value,
        surname: (getElement('#name-sign-up') as HTMLInputElement).value,
      });
      console.log('Document written with ID: ', userAdd.id);
      console.log(user.user.uid);
      document.cookie = `UID = ${user.user.uid}`;
    } catch {
      console.log(`There was an error`);
    }
  }
}
