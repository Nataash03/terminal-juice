// frontend/app/mission/page.tsx
import React from 'react';
import styles from './MissionPage.module.css';

// Data untuk mission points
const missionPoints = [
  { 
    title: "Health & Wellness", 
    description: "Every cup is packed with vitamins, antioxidants, and natural goodness to support your health journey.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" stroke="#FF1493" strokeWidth="2"/>
        <path d="M12 16l3 3 5-6" stroke="#FF1493" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#FF1493'
  },
  { 
    title: "Innovation & Quality", 
    description: "We continuously innovate our recipes and processes to deliver the highest quality juice experience.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4l4 8 8 1-6 6 2 8-8-4-8 4 2-8-6-6 8-1 4-8z" stroke="#9D4EDD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: '#9D4EDD'
  },
  { 
    title: "Freshness Guaranteed", 
    description: "Every cup is made fresh daily to ensure the best flavor, nutrients, and experience in every sip.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16 4v12l8 8" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 28c6.627 0 12-5.373 12-12S22.627 4 16 4 4 9.373 4 16s5.373 12 12 12z" stroke="#10B981" strokeWidth="2"/>
      </svg>
    ),
    color: '#10B981'
  },
];

export default function MissionPage() {
  return (
    <div className={styles.missionPageContainer}>
      {/* Main Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.missionContent}>
          <h1 className={styles.mainTitle}>
            Our <span className={styles.highlightOrange}>mission</span>
          </h1>
          <p className={styles.missionText}>
            At Terminal Juice, our mission is to make healthy, delicious drinks more accessible for everyone on campus. We believe that wellness starts with small, everyday choices — like what you put over artificial flavorings.
          </p>
          
          <div className={styles.quoteBox}>
            <p className={styles.quoteText}>
              "Building a healthier tomorrow, one cup at a time."
            </p>
            <p className={styles.quoteAuthor}>- The terminal juice Team</p>
          </div>
        </div>

        <div className={styles.missionFeatures}>
          {/* Mission Points with Icons */}
          <div className={styles.featuresList}>
            {missionPoints.map((point, index) => (
              <div key={index} className={styles.featureItem}>
                <div className={styles.featureIcon} style={{ borderColor: point.color }}>
                  {point.icon}
                </div>
                <div className={styles.featureContent}>
                  <h3 className={styles.featureTitle}>{point.title}</h3>
                  <p className={styles.featureDescription}>{point.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Cards */}
          <div className={styles.statsCards}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>100%</div>
              <p className={styles.statLabel}>Natural fruit content<br />in every cup</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>10+</div>
              <p className={styles.statLabel}>Feel good<br />flavours</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}