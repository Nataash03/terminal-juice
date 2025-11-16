// File: frontend/app/components/Profile/MyProfileDetails.tsx

'use client';

import React, { useState, useEffect } from 'react';
import styles from './MyProfileDetails.module.css'; 

// --- DEFINISI TIPE USER ---
interface UserProfile {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
    // Tambahkan field lain dari backend jika perlu
}

interface MyProfileDetailsProps {
    // 🚨 Menerima data user yang sudah di-fetch dari profile/page.tsx
    userData: UserProfile; 
}

const MyProfileDetails: React.FC<MyProfileDetailsProps> = ({ userData }) => {
    // State untuk data yang sedang diedit (diinisialisasi dari prop)
    const [formData, setFormData] = useState(userData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Effect untuk update formData jika userData (prop) berubah (misalnya, setelah fetch ulang)
    useEffect(() => {
        setFormData(userData);
    }, [userData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!, // Gunakan non-null assertion atau pengecekan
            [name]: value,
        }));
    };

    const handleSave = async () => {
        // 🚨 LOGIKA UPDATE PROFIL BACKEND (PATCH)
        setIsSaving(true);
        setSaveError(null);
        const token = localStorage.getItem('userToken');
        
        try {
            const response = await fetch('http://localhost:5001/api/users/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    phone: formData.phone,
                    address: formData.address,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert("Perubahan berhasil disimpan!");
                // Panggil re-fetch dari parent jika kamu ingin data langsung segar
                // Tapi untuk saat ini, kita hanya keluar dari mode edit
                setIsEditing(false); 
            } else {
                throw new Error(result.message || "Gagal menyimpan perubahan.");
            }

        } catch (error: any) {
            setSaveError(error.message);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="profile-detail-content">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>

            {saveError && <div style={{color: 'red', marginBottom: '10px'}}>{saveError}</div>}

            <div className="grid grid-cols-2 gap-4">
                
                {/* 🚨 DATA LIVE: Full Name */}
                <div className="detail-item">
                    <p>Full Name</p>
                    <input 
                        name="fullName"
                        value={formData.fullName} 
                        onChange={handleInputChange}
                        readOnly={!isEditing} 
                        className={styles.formInput}
                    />
                </div>
                <br>
                </br>

                {/* 🚨 DATA LIVE: Email Address */}
                <div className="detail-item">
                    <p>Email Address</p>
                    <input 
                        name="email"
                        value={formData.email} 
                        readOnly // Email read-only
                        className={styles.formInput}
                    />
                </div>
                <br>
                </br>
                
                {/* 🚨 DATA LIVE: Phone Number */}
                <div className="detail-item">
                    <p>Phone Number</p>
                    <input 
                        name="phone"
                        value={formData.phone || ''} 
                        onChange={handleInputChange}
                        readOnly={!isEditing}
                        className={styles.formInput}
                    />
                </div>
                <br>
                </br>
                
                {/* 🚨 DATA LIVE: Address */}
                <div className="detail-item">
                    <p>Address</p>
                    <input 
                        name="address"
                        value={formData.address || ''} 
                        onChange={handleInputChange}
                        readOnly={!isEditing} 
                        className={styles.formInput}
                    />
                </div>
                <br>
                </br>
            </div>

            {/* --- Tombol Edit/Save --- */}
            <div className="button-group mt-6">
                {!isEditing ? (
                    // 🚨 TOMBOL EDIT
                    <button 
                className={styles.editButton} // 🚨 Gunakan class yang benar
                onClick={() => setIsEditing(true)}
            >
                Edit
            </button>
        ) : (
            <div className={styles.submitWrapper}> {/* Gunakan wrapper untuk flex-end */}
                {/* TOMBOL SAVE CHANGES */}
                    <button 
                    className={styles.submitButton} // 🚨 Gunakan class submit
                    onClick={handleSave} 
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {/* TOMBOL BATAL */}
                <button 
                    className={styles.cancelButton} // 🚨 Gunakan class cancel
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                >
                    Cancel
                </button>
            </div>
        )}
    </div>
        </div>
    );
};

export default MyProfileDetails;