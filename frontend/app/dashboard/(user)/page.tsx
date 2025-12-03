"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styles from "./UserProfile.module.css"; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export default function UserProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      if (!token) return;
      try {
        const res = await fetch(`${baseUrl}/api/users/profile`, { 
            headers: { Authorization: `Bearer ${token}` } 
        });
        const data = await res.json();
        if (data.success || data.user) setUser(data.user || data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setUser((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
      setIsSaving(true);
      const token = Cookies.get("token");
      
      try {
          const res = await fetch(`${baseUrl}/api/users/profile`, {
              method: 'PUT', 
              headers: { 
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}` 
              },
              body: JSON.stringify({
                  fullName: user.fullName || user.username,
                  username: user.username || user.fullName,
                  address: user.address,
                  phone: user.phone
              })
          });

          const result = await res.json();

          if (res.ok) {
              alert("Profile berhasil disimpan! 🎉");

              const oldUserStorage = JSON.parse(localStorage.getItem('user') || '{}');
              const updatedUserStorage = { 
                  ...oldUserStorage, 
                  username: user.fullName || user.username, 
                  fullName: user.fullName || user.username,
                  address: user.address
              };
              localStorage.setItem('user', JSON.stringify(updatedUserStorage));

              window.dispatchEvent(new Event('storage'));

          } else {
              alert("Gagal update: " + (result.message || "Error"));
          }
      } catch (error) {
          alert("Error koneksi server.");
      } finally {
          setIsSaving(false);
      }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
          <h1 className={styles.profileTitle}>My Profile</h1>
          <div className={styles.formContainer}>
            <input 
                type="text" 
                name="fullName"
                className={styles.formInput}
                value={user?.fullName || user?.username || ''} 
                onChange={handleChange}
                placeholder="Full Name" 
            />
            
            <input 
                type="email" 
                className={`${styles.formInput} ${styles.inputReadOnly}`}
                value={user?.email || ''} 
                readOnly 
            />
            
            <input 
                type="text" 
                name="address"
                className={styles.formInput}
                placeholder="Address" 
                value={user?.address || ''} 
                onChange={handleChange}
            />
            
            <button 
                onClick={handleSave} 
                disabled={isSaving}
                className={styles.saveButton}
            >
                {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
    </div>
  );
}