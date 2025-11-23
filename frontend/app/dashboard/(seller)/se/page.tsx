import styles from './SellerDashboard.module.css';
export default function SellerDashboard() {
  return (
    <div>
      <h2 className={styles.title}>Sales Dashboard</h2>
      <div className={styles.grid}>
        <div className={styles.card}><div className={styles.value}>Rp 100jt</div><div className={styles.label}>Total Sales</div></div>
        <div className={styles.card}><div className={styles.value}>30</div><div className={styles.label}>Total Orders</div></div>
      </div>
    </div>
  );
}