'use client';

import React from 'react';
import styles from './SupportModal.module.css'; 

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'contact' | 'faq' | 'shopping' | 'returns' | null;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  const phoneNumber = "6287774832229"; 
  const message = "Halo Terminal Juice! Saya mau tanya tentang produk jusnya dong..."; 

  const renderContent = () => {
    switch (type) {
      case 'contact':
        return (
          <>
            <h2 className={styles.title}>Contact Us</h2>
            <p className={styles.text}>Butuh bantuan cepat? Langsung chat kami di WhatsApp!</p>
            
            {/* Tombol WA */}
            <a 
              href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.waButton}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382C17.112 14.022 15.337 13.132 15 13.007C14.663 12.882 14.423 12.812 14.183 13.172C13.943 13.532 13.248 14.382 13.048 14.622C12.848 14.862 12.643 14.887 12.293 14.712C11.943 14.537 10.818 14.167 9.483 12.977C8.443 12.047 7.738 10.902 7.538 10.552C7.338 10.202 7.518 10.022 7.693 9.847C7.848 9.692 8.043 9.442 8.218 9.232C8.393 9.022 8.453 8.867 8.568 8.632C8.683 8.397 8.623 8.197 8.548 8.042C8.473 7.887 7.798 6.232 7.513 5.577C7.233 4.937 6.953 5.027 6.748 5.027C6.558 5.022 6.338 5.022 6.118 5.022C5.898 5.022 5.533 5.107 5.223 5.447C4.913 5.787 4.033 6.617 4.033 8.307C4.033 9.997 5.263 11.632 5.443 11.872C5.623 12.112 7.878 15.737 11.448 17.137C14.933 18.507 14.933 18.047 15.553 17.972C16.173 17.897 17.553 17.137 17.838 16.337C18.123 15.537 18.123 14.862 18.048 14.737C17.968 14.612 17.768 14.537 17.472 14.382Z"/>
              </svg>
              Chat WhatsApp
            </a>
            
            <div style={{marginTop: '20px'}}>
                <div className={styles.item}>
                <strong>📍 Alamat:</strong> UNTAR Kampus 1, Gedung P
                </div>
                <div className={styles.item}>
                <strong>⏰ Jam Operasional:</strong> 08:00 - 17.00 WIB
                </div>
            </div>
          </>
        );
      case 'faq':
        return (
          <>
            <h2 className={styles.title}>Frequently Asked Questions</h2>
            <div className={styles.item}>
              <strong>Q: Apakah jus ini pakai gula tambahan?</strong>
              <div>A: Tidak! 100% buah murni tanpa gula tambahan. Tapi jika mau ditambah gula/susu bisa.</div>
            </div>
            <div className={styles.item}>
              <strong>Q: Berapa lama jus bisa bertahan?</strong>
              <div>A: 3 hari di kulkas, 2 jam di suhu ruang.</div>
            </div>
            <div className={styles.item}>
              <strong>Q: Apakah bisa request tanpa es?</strong>
              <div>A: Bisa banget! Tulis di notes saat checkout ya.</div>
            </div>
          </>
        );
      case 'shopping':
        return (
          <>
            <h2 className={styles.title}>Shopping Info</h2>
            <p className={styles.text}>
              Kami menerima pembayaran via QRIS, Transfer Bank, dan Cash.
              <br /><br />
              Sistem pengambilan yaitu dengan datang dan ambil sendiri atau jika pesanan merupakan 'group order' bisa diantar ke gedung fakultas.
            </p>
          </>
        );
      case 'returns':
        return (
          <>
            <h2 className={styles.title}>Returns Policy</h2>
            <p className={styles.text}>
              Kepuasan Anda adalah prioritas kami. Kami berkomitmen untuk selalu menjaga kualitas dan
              kesegaran setiap bahan yang kami pakai.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        <div className={styles.content}>
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SupportModal;