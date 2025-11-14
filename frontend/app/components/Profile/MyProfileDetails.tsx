// frontend/app/components/Profile/MyProfileDetails.tsx
'use client'; 

import React, { useState } from 'react';
import styles from './MyProfileDetails.module.css'; // <-- Import CSS Modules

export default function MyProfileDetails() {
    // ... (State dan handleChange/handleSubmit tetap sama) ...
    const [userData, setUserData] = useState({
        fullName: "Pengguna UAS",
        email: "user@example.com",
        phone: "081234567890",
        address: "Jl. Contoh No. 123",

    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Profile updated! (Simulasi)');
    };
    
    return (
        <div className={styles.container}>
            <h2 className={styles.profileTitle}>My Profile</h2>
            
            <form onSubmit={handleSubmit} className={styles.profileForm}>
                {/* Full Name */}
                <div>
                    <label htmlFor="fullName" className={styles.formLabel}>Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Your Full Name"
                    />
                </div>

                {/* Email Address */}
                <div>
                    <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="your@email.com"
                    />
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phone" className={styles.formLabel}>Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="e.g., 081234567890"
                    />
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className={styles.formLabel}>Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        className={styles.formInput}
                        placeholder="Your Delivery Address"
                    />
                </div>

                {/* Submit Button */}
                <div className={styles.submitWrapper}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}