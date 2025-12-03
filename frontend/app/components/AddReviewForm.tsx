import React, { useState, useEffect } from 'react';
import styles from './AddReviewForm.module.css'; 

interface AddReviewFormProps {
  onSubmit: (review: { quote: string; author: string; role: string; rating: number }) => void;
}

const AddReviewForm: React.FC<AddReviewFormProps> = ({ onSubmit }) => {
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('Customer');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const name = user.username || user.fullName || user.name || 'User';
        setAuthorName(name);
        setRole('Verified Buyer'); 
        setIsLoggedIn(true);
      } catch (e) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote) return alert("Mohon isi review kamu!");

    onSubmit({
      quote,
      author: authorName,
      role,
      rating: Number(rating)
    });

    setQuote('');
    alert("Terima kasih! Review kamu berhasil ditambahkan.");
  };

  if (!isLoggedIn) {
     return (
         <div className={styles.notLoggedIn}>
             <p>Silakan <strong>Login</strong> terlebih dahulu untuk menulis review.</p>
         </div>
     )
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Tulis Review Jujur Kamu ✨</h3>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        
        {/* Nama (Read Only) */}
        <div className={styles.inputGroup}>
            <label className={styles.label}>Nama Pengirim</label>
            <input 
                type="text" 
                value={authorName} 
                disabled 
                className={`${styles.input} ${styles.inputReadOnly}`} 
            />
        </div>

        {/* Rating */}
        <div className={styles.inputGroup}>
            <label className={styles.label}>Rating</label>
            <select 
                value={rating} 
                onChange={(e) => setRating(Number(e.target.value))}
                className={styles.select}
            >
                <option value="5">⭐⭐⭐⭐⭐ (Sempurna)</option>
                <option value="4">⭐⭐⭐⭐ (Enak)</option>
                <option value="3">⭐⭐⭐ (Biasa Aja)</option>
                <option value="2">⭐⭐ (Kurang)</option>
                <option value="1">⭐ (Kecewa)</option>
            </select>
        </div>

        {/* Komentar */}
        <div className={styles.inputGroup}>
            <label className={styles.label}>Komentar</label>
            <textarea 
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder="Ceritain pengalaman minum Terminal Juice..."
                rows={3}
                className={styles.textarea}
                required
            />
        </div>

        <button type="submit" className={styles.submitButton}>
            Kirim Review
        </button>
      </form>
    </div>
  );
};

export default AddReviewForm;