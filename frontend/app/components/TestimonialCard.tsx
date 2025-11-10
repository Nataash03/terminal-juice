// frontend/app/components/TestimonialCard.tsx

import React from 'react';
import styles from './TestimonialCard.module.css';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const StarRating: React.FC = () => {
  // Komponen sederhana untuk menampilkan 5 bintang
  return (
    <div className={styles.stars}>
      {'⭐'.repeat(5)}
    </div>
  );
};

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => {
  return (
    <div className={styles.card}>
      <StarRating />
      <p className={styles.quote}>{quote}</p>
      <p className={styles.author}>{author}</p>
      <p className={styles.role}>{role}</p>
    </div>
  );
};

export default TestimonialCard;