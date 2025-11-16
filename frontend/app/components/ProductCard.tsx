// frontend/app/components/ProductCard.tsx
'use client';

import React from 'react';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  name: string;
  price: number;
  imageSrc: string;
  bgColor: string;
  id: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageSrc, bgColor }) => {
  const formatPrice = (price: number) => {
    return `Rp.${price.toLocaleString('id-ID')}`;
  };

  return (
    <div className={styles.productCard}>
      <div
        className={styles.imageContainer}
        style={{ backgroundColor: bgColor }}
      >
        <img
          src={imageSrc}
          alt={name}
          className={styles.productImage}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.png';
          }}
        />
      </div>
      <div className={styles.productInfo}>
        <h3 className={styles.productName}>{name}</h3>
        <p className={styles.productPrice}>{formatPrice(price)}</p>
      </div>
    </div>
  );
};

export default ProductCard;