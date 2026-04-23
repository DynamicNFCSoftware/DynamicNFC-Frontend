import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    async function checkAdmin() {
      if (!user?.email) {
        setIsAdmin(false);
        setAdminRole(null);
        setAdminLoading(false);
        return;
      }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.email));
        const exists = adminDoc.exists();
        setIsAdmin(exists);
        setAdminRole(exists ? (adminDoc.data().role || 'admin') : null);
      } catch (err) {
        console.error('Admin check failed:', err);
        setIsAdmin(false);
        setAdminRole(null);
      }
      setAdminLoading(false);
    }
    checkAdmin();
  }, [user]);

  return { isAdmin, adminRole, adminLoading };
}
