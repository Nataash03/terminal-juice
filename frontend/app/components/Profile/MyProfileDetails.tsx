'use client';

import React, { useState, useEffect } from 'react';
import styles from './MyProfileDetails.module.css'; 

interface UserProfile {
    fullName: string;
    email: string;
    phone?: string;
    address?: string;
}

interface MyProfileDetailsProps {
    userData: UserProfile; 
}

const MyProfileDetails: React.FC<MyProfileDetailsProps> = ({ userData }) => {
    const [formData, setFormData] = useState(userData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(userData);
    }, [userData]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev!, 
            [name]: value,
        }));
    };

    const handleSave = async () => {
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
                
                {/* Full Name */}
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

                {/* Email Address */}
                <div className="detail-item">
                    <p>Email Address</p>
                    <input 
                        name="email"
                        value={formData.email} 
                        readOnly 
                        className={styles.formInput}
                    />
                </div>
                <br>
                </br>
                
                {/* Phone Number */}
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
                
                {/* Address */}
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

            {/* Tombol Edit/Save */}
            <div className="button-group mt-6">
                {!isEditing ? (
                    <button 
                className={styles.editButton} 
                onClick={() => setIsEditing(true)}
            >
                Edit
            </button>
        ) : (
            <div className={styles.submitWrapper}> 
                {/* TOMBOL SAVE CHANGES */}
                    <button 
                    className={styles.submitButton} 
                    onClick={handleSave} 
                    disabled={isSaving}
                >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                {/* TOMBOL BATAL */}
                <button 
                    className={styles.cancelButton} 
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