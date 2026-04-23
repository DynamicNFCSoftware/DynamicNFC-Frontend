import { useQuery } from '@tanstack/react-query';
import { collection, doc, getDocs, getDoc, query as fsQuery } from 'firebase/firestore';
import { db } from '../firebase';

export function useCollection(collectionName, queryConstraints = [], options = {}) {
  return useQuery({
    queryKey: ['collection', collectionName, ...queryConstraints.map(String)],
    queryFn: async () => {
      const ref = queryConstraints.length
        ? fsQuery(collection(db, collectionName), ...queryConstraints)
        : collection(db, collectionName);
      const snap = await getDocs(ref);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    },
    ...options,
  });
}

export function useDocument(collectionName, docId, options = {}) {
  return useQuery({
    queryKey: ['document', collectionName, docId],
    queryFn: async () => {
      if (!docId) return null;
      const snap = await getDoc(doc(db, collectionName, docId));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    },
    enabled: !!docId,
    ...options,
  });
}
