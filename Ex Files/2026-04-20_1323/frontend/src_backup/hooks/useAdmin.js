import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user?.email) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.email));
        setIsAdmin(adminDoc.exists());
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
      }
      setAdminLoading(false);
    }
    checkAdmin();
  }, [user]);

  return { isAdmin, adminLoading };
}
