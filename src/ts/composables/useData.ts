// useData.ts
import { db } from './../modules/firebase';
import { collection, getDocs, query, limit, QuerySnapshot, DocumentSnapshot, Query } from 'firebase/firestore';

export async function getDoc(dbName: string) {
  return await getDocs(collection(db, dbName));
}

export function q(dbName: string, limitNum: number) {
  return query(collection(db, dbName), limit(limitNum));
}

export async function getDocQ(q: Query) {
  return await getDocs(q);
}

export function querySnapshot(data: QuerySnapshot, callback: (doc: DocumentSnapshot) => void) {
  data.forEach((doc) => {
    callback(doc);
  });
}
