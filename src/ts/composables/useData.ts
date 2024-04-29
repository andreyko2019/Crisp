import { db } from './../modules/firebase';
import { collection, getDocs, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

export async function getDoc(dbName: string) {
  return await getDocs(collection(db, dbName));
}

export async function querySnapshot(data: QuerySnapshot, callback: (doc: DocumentSnapshot) => void) {
  const querySnapshot: QuerySnapshot = data;
  querySnapshot.forEach((doc) => {
    callback(doc);
  });
}
