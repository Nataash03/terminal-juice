'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import SupportModal from './SupportModal'; 

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'contact' | 'faq' | 'shopping' | 'returns' | null>(null);
  
  // State untuk Subscribe Email
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Data Link Sosmed
  const myGithubUrl = "https://github.com/Nataash03/terminal-juice"; 
  const phoneNumber = "6287774832229"; 
  const waMessage = "Halo, saya mau pesan jus...";
  const instagramUrl = "https://instagram.com/terminal_juice_2023";


  // Handler Submit Email
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribeStatus('loading');

    try {
        const res = await fetch(`${baseUrl}/api/subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        
        if (data.success) {
            setSubscribeStatus('success');
            setEmail('');
            alert('Terima kasih, Anda berhasil berlangganan!');
        } else if (res.status === 409) {
             setSubscribeStatus('error');
             alert('Email ini sudah terdaftar!');
        } else {
             throw new Error(data.message || 'Gagal menyimpan email');
        }

    } catch (error) {
        setSubscribeStatus('error');
        alert('Gagal subscribe. Cek koneksi backend atau email yang dimasukkan.');
    } finally {
        // Reset status setelah 3 detik
        setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };


  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.container}>
          
          {/* Brand Section */}
          <div className={styles.brandSection}>
            <h3 className={styles.brandName}>terminal juice.</h3>
            <p className={styles.brandTagline}>
              Savour the juicy essence of fruit in every sip. Natural, delicious, and made with love.
            </p>
            
            <div className={styles.socialIcons}>
              {/* 1. GITHUB */}
              <a href={myGithubUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Built by Developers">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>

              {/* 2. WHATSAPP */}
              <a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Chat on WhatsApp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>

              {/* 3. INSTAGRAM */}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.socialIcon} title="Follow us on Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5"></line>
                </svg>
              </a>

            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.linksTitle}>Quick Links</h4>
            <ul className={styles.linksList}>
              <li><Link href="/shop">Shop All</Link></li>
              <li><Link href="/flavours">Flavours</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/mission">Our Mission</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className={styles.linksSection}>
            <h4 className={styles.linksTitle}>Support</h4>
            <ul className={styles.linksList}>
              <li onClick={() => setActiveModal('contact')} style={{cursor:'pointer'}}>Contact Us</li>
              <li onClick={() => setActiveModal('faq')} style={{cursor:'pointer'}}>FAQs</li>
              <li onClick={() => setActiveModal('shopping')} style={{cursor:'pointer'}}>Shopping Info</li>
              <li onClick={() => setActiveModal('returns')} style={{cursor:'pointer'}}>Returns</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className={styles.newsletterSection}>
            <h4 className={styles.linksTitle}>Stay Fresh</h4>
            <p className={styles.newsletterText}>
              Subscribes to get updates on new flavours and exclusive offers.
            </p>
            {/* Form */}
            <form className={styles.newsletterForm} onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email" 
                className={styles.emailInput}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" className={styles.submitButton} disabled={subscribeStatus === 'loading'}>
                 {subscribeStatus === 'success' ? '✓' : 
                  subscribeStatus === 'loading' ? '...' : 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                 }
              </button>
            </form>
            {/* Status Feedback (Opsional) */}
            {subscribeStatus === 'success' && <p style={{color: '#25D366', marginTop: 8, fontSize: '0.8rem'}}>Subscribed!</p>}
            {subscribeStatus === 'error' && <p style={{color: 'red', marginTop: 8, fontSize: '0.8rem'}}>Failed/Exists.</p>}

          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            © 2025 terminal juice. All rights reserved.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/cookies">Cookie Policy</Link>
          </div>
        </div>
      </footer>

      {/* Komponen Modal untuk Support */}
      <SupportModal 
        isOpen={!!activeModal} 
        type={activeModal} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
};

export default Footer;