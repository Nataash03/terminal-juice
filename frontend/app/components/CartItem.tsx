import React, { useState, useEffect } from 'react'; 
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
  onDelete: (id: string | number) => void; 
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
  onSelectChange,
  onDelete 
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

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

  // Logic Hapus
  const handleDelete = () => {
    if(confirm("Yakin mau hapus item ini dari keranjang?")) {
        onDelete(id);
    }
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

      {/* Quantity, Price, & DELETE */}
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

        {/* Tombol Delete */}
        <button 
            onClick={handleDelete}
            className={styles.deleteButton}
            aria-label="Hapus Item"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;