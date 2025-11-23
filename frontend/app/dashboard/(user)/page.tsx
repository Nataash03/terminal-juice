"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./UserProfile.module.css"; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      try {
        const res = await fetch(`${baseUrl}/api/users/profile`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  if (loading) return <p style={{padding: 40}}>Loading profile...</p>;

  return (
    <div>
      <h1 className={styles.title}>My Profile</h1>
      <form className={styles.formGrid}>
        <input type="text" className={styles.input} defaultValue={user?.fullName} placeholder="Full Name" />
        <input type="email" className={`${styles.input} ${styles.fullWidth}`} defaultValue={user?.email} readOnly style={{background:'#f9f9f9'}} />
        <input type="text" className={`${styles.input} ${styles.fullWidth}`} placeholder="Address" defaultValue={user?.address || ''} />
        <button type="button" className={styles.saveBtn}>Save Changes</button>
      </form>
    </div>
  );
}