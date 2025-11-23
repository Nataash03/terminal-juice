import React, { useState } from 'react';
import styles from './ProductDetailModal.module.css';

export interface ProductForModal {
  id: string;
  name: string;
  price: number;
  imageSrc: string;
  bgColor?: string;
  description: string;
  stock: number;
  category?: string; 
  tags?: string[];
}

type ProductModalProps = {
  product: ProductForModal | null;
  onClose: () => void;
  onAddToCart: (product: ProductForModal, quantity: number) => void;
  onOrderNow: (product: ProductForModal, quantity: number) => void;
};

const ProductDetailModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOrderNow, 
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleLocalAddToCartClick = () => {
    onAddToCart(product, quantity); 
    setQuantity(1); 
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className={styles.modalBody}>
          {/* Bagian Gambar */}
          <div className={styles.imageSection}>
            <div
              className={styles.imageContainer}
              style={{ backgroundColor: product.bgColor || '#f0f0f0' }}
            >
              <img
                src={product.imageSrc}
                alt={product.name}
                className={styles.productImage}
              />
            </div>
          </div>

          {/* Bagian Detail */}
          <div className={styles.detailSection}>
            <h2 className={styles.productName}>{product.name}</h2>
            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.priceStockContainer}>
              <div className={styles.priceTag}>
                Rp.{product.price.toLocaleString('id-ID')}
              </div>
              <div className={styles.stockBadge}>{product.stock} pcs</div>
            </div>

            {/* Kontrol Quantity */}
            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Quantity</span>
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="text"
                  className={styles.quantityInput}
                  value={quantity}
                  readOnly
                />
                <button
                  className={styles.quantityButton}
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className={styles.actionButtons}>
              <button
                className={styles.addToCartButton}
                onClick={handleLocalAddToCartClick}
              >
                🛒 Add to Cart
              </button>
              
              <button 
                className={styles.orderNowButton}
                onClick={() => onOrderNow(product, quantity)}
              >
                Order Now
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;