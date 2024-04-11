import { db } from './../modules/firebase';
import { collection, getDocs, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore';

export async function getDoc(dbName: string) {
  return await getDocs(collection(db, dbName));
}

export async function querySnapshot(dbName: string, callback: (doc: DocumentSnapshot) => void) {
  const querySnapshot: QuerySnapshot = await getDoc(dbName);
  querySnapshot.forEach((doc) => {
    callback(doc);
  });
}
