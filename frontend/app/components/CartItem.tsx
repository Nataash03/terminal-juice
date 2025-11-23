import React, { useState } from 'react';
import styles from './CartItem.module.css';

interface CartItemProps {
  id: string | number;
  name: string;
  imageSrc: string;
  details: string;
  initialQuantity: number;
  price: number;
  isSelected: boolean;
  onQuantityChange: (id: string | number, newQuantity: number) => void;
  onSelectChange: (id: string | number, isSelected: boolean) => void;
}

const CartItem: React.FC<CartItemProps> = ({ 
  id, 
  name, 
  imageSrc, 
  details, 
  initialQuantity, 
  price,
  isSelected,
  onQuantityChange,
  onSelectChange
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onQuantityChange(id, newQuantity);
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    onQuantityChange(id, newQuantity);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange(id, e.target.checked);
  };

  const formattedPrice = `Rp.${(price * quantity).toLocaleString('id-ID')}`;

  return (
    <div className={styles.itemCard}>
      {/* Checkbox */}
      <div className={styles.selectArea}>
        <input 
          type="checkbox" 
          className={styles.checkbox}
          checked={isSelected}
          onChange={handleCheckboxChange}
        /> 
      </div>

      {/* Product Info */}
      <div className={styles.productInfo}>
        <div className={styles.imageWrapper}>
          <img src={imageSrc} alt={name} className={styles.productImage} />
        </div>
        <div className={styles.details}>
          <h4 className={styles.productName}>{name}</h4>
          <p className={styles.productDetails}>{details}</p>
        </div>
      </div>

      {/* Quantity and Price */}
      <div className={styles.actions}>
        <div className={styles.quantityControl}>
          <button 
            onClick={handleDecrease} 
            disabled={quantity === 1}
            className={styles.quantityButton}
          >
            −
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button 
            onClick={handleIncrease}
            className={styles.quantityButton}
          >
            +
          </button>
        </div>
        <div className={styles.itemPrice}>{formattedPrice}</div>
      </div>
    </div>
  );
};

export default CartItem;