// frontend/app/about/page.tsx
// Halaman "About Us"

import React from 'react';
import TestimonialCard from '../components/TestimonialCard';
import styles from './AboutPage.module.css';

const testimonialsData = [
  { 
    quote: "I've tried countless juice brands, but terminal juice truly stands out. The passion fruit guava is incredible - you can taste the real fruit in every sip!", 
    author: 'Helen Mak', 
    role: 'Fitness Enthusiast' 
  },
  { 
    quote: "As a health coach, I recommend alldae to all my clients. The natural ingredients and amazing taste make it easy to stay hydrated and healthy.", 
    author: 'Marcus Chen', 
    role: 'Health Coach' 
  },
  { 
    quote: "Great pick me up! The ginger yuzu flavor is perfect after my morning yoga sessions. Love that there are no artificial additives!", 
    author: 'Sarah Williams', 
    role: 'Yoga Instructor' 
  },
];

export default function AboutPage() {
  return (
    <div className={styles.aboutPageContainer}>
      
      {/* Bagian Who We Are */}
      <section className={styles.whoWeAreSection}>
        <div className={styles.contentLeft}>
          <h1 className={styles.sectionTitle}>Who we are?</h1>
          <p className={styles.textBlock}>
            Our team of passionate food scientists, farmers, and flavor enthusiasts work tirelessly to create juice that not only tastes amazing but also nourishes your body with real, whole-food ingredients.
          </p>
          <p className={styles.textBlock}>
            Every bottle tells a story of dedication, sustainability, and a genuine love for nature's bounty. We're not just making juice — we're crafting experiences that brighten your day, one sip at a time.
          </p>
        </div>
        
        {/* Gambar Buah Beri dan Jeruk */}
        <div className={styles.imageRight}>
          {/* Asumsikan gambar disimpan di /public/images/about-fruits.jpg */}
          <img src="/public/images/who-are-we.jpg" alt="Mixed berries and oranges" />
        </div>
      </section>

      {/* Bagian Testimonial */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialHeader}>
          <span className={styles.emoji}>🤩</span>
          <h2 className={styles.testimonialTitle}>
            Our costumers <span className={styles.loveHighlight}>love us</span>
          </h2>
        </div>
        
        <div className={styles.testimonialGrid}>
          {testimonialsData.map((t, index) => (
            <TestimonialCard 
              key={index}
              quote={t.quote}
              author={t.author}
              role={t.role}
            />
          ))}
        </div>

        {/* Placeholder untuk dot slider/pagination */}
        <div className={styles.sliderDots}>
            <span className={styles.dotActive}></span>
            <span className={styles.dot}></span>
            <span className={styles.dot}></span>
        </div>
      </section>
      
    </div>
  );
}