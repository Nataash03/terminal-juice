import React from 'react';
import styles from './TestimonialCard.module.css';

interface TestimonialProps {
  id?: string;
  quote: string;
  author: string;
  role: string;
  rating?: number;
  isOwner?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const StarRating: React.FC<{ count: number }> = ({ count }) => {
  const validCount = Math.max(1, Math.min(count, 5));
  return (
    <div className={styles.stars}>
      {'⭐'.repeat(validCount)}
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialProps> = ({ 
  id,
  quote, 
  author, 
  role, 
  rating = 5,
  isOwner,
  onEdit,
  onDelete
}) => {
  return (
    <div className={styles.card}>
      
      <StarRating count={rating} />
      
      <p className={styles.quote}>"{quote}"</p>
      
      {/* Wrapper Info Author */}
      <div className={styles.authorInfo}> 
        <p className={styles.author}>{author}</p>
        <p className={styles.role}>{role}</p>
      </div>

      {/* Tombol Aksi */}
      {isOwner && id && (
          <div className={styles.actionButtons}>
              <button 
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={(e) => { e.stopPropagation(); onEdit && onEdit(id); }}
                  title="Edit Review"
              >
                  ✏️
              </button>
              
              <button 
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={(e) => { e.stopPropagation(); onDelete && onDelete(id); }}
                  title="Hapus Review"
              >
                  🗑️
              </button>
          </div>
      )}
    </div>
  );
};

export default TestimonialCard;