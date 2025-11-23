// app/about/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import TestimonialCard from '../components/TestimonialCard';
import styles from './AboutPage.module.css';

// 1. TIPE DATA
interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

const testimonialsData: TestimonialItem[] = [
  { quote: "I've tried countless juice brands, but terminal juice truly stands out. The passion fruit guava is incredible - you can taste the real fruit in every sip!", author: 'Angel', role: 'Economic Bussiness Student' },
  { quote: "As a health enthusiat, I recommend it. The natural ingredients and amazing taste make it easy to stay hydrated and healthy.", author: 'Marcus', role: 'Engineering Student' },
  { quote: "Great pick me up! The ginger yuzu flavor is perfect after my morning class. Love that there are no artificial additives!", author: 'Sarah', role: 'IT Staff' },
  { quote: "The avocado are a game-changer! Fantastic immunity boost and the taste is surprisingly smooth. Highly recommend!", author: 'David', role: 'Arts and Design Student' },
  { quote: "The packaging is ok and the taste is even better. My new favourite way to hydrate!", author: 'Eva', role: 'Marketing Team' },
  { quote: "Best juice for detox, hands down! The flavors are unique and authentic. A must-buy.", author: 'Eka', role: 'Law Student' },
  { quote: "Absolutely the perfect juice for a fresh detox! Rasanya natural dan super enak. Worth every sip!", author: 'Lily', role: 'IT Student' },
  { quote: "Top-tier detox juice! Flavor-nya rich dan alami banget. Pasti bakal beli lagi!", author: 'Zahra', role: 'Medical Student' },
  { quote: "One of the best detox juices I’ve tried! Seger, authentic, dan bikin nagih. Definitely recommended!", author: 'Gilbert', role: 'Pyschology Student' },
];

// 2. CHUNK UTILITY (4 kartu per slide)
const chunk = (arr: TestimonialItem[], size: number): TestimonialItem[][] => {
  const out: TestimonialItem[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

export default function AboutPage() {
  const slides = chunk(testimonialsData, 4);
  const [index, setIndex] = useState(0);
  const slidesCount = slides.length;

  // For touch/swipe
  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const prev = () => setIndex((i) => (i - 1 + slidesCount) % slidesCount);
  const next = () => setIndex((i) => (i + 1) % slidesCount);
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, slidesCount - 1)));

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slidesCount]);

  // Touch handlers (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const endX = e.changedTouches[0].clientX;
    const delta = startX.current - endX;
    const threshold = 40; // minimal px to consider swipe
    if (delta > threshold) next();
    if (delta < -threshold) prev();
    startX.current = null;
  };

  // Pointer (mouse drag) support
  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startX.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const delta = startX.current - e.clientX;
    const threshold = 40;
    if (delta > threshold) next();
    if (delta < -threshold) prev();
    startX.current = null;
  };

  return (
    <div className={styles.aboutPageContainer}>
      {/* --- WHO WE ARE (simple placeholder; you can keep your original markup) --- */}
      <section className={styles.whoSection}>
        <div className={styles.whoLeft}>
          <h1>Who we are?</h1>
          <p>
          We’re a team of four students coding our way through this project. Our website isn’t <strong>ju(ice)st</strong> functional—it’s crafted with <strong>creativity, teamwork, and a splash of fun!</strong>
          </p>
          <p>
            Every bottle tells a story of dedication, sustainability, and a genuine love for nature's bounty. We're not just making juice - we're crafting experiences that brighten your day, one sip at a time.
          </p>
        </div>
        <div className={styles.whoRight}>
          <img src="/images/who-are-we.png" alt="Fruits" className={styles.whoImg} />
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialHeaderWrapper}>
          <span className={styles.emoji}>🤩</span>
          <h2 className={styles.testimonialTitle}>
            Our costumers <span className={styles.loveHighlight}>love us</span>
          </h2>
        </div>

        <div
          className={styles.testimonialCarouselContainer}
          ref={containerRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* slides wrapper that translates */}
          <div
            className={styles.slidesContainer}
            style={{ width: `${slidesCount * 100}%`, transform: `translateX(-${index * (100 / slidesCount)}%)` }}
            aria-live="polite"
          >
            {slides.map((group, sIdx) => (
              <div key={sIdx} className={styles.slide} aria-hidden={sIdx !== index}>
                <div className={styles.cardGroup}>
                  {group.map((t, cardIndex) => (
                    <div key={cardIndex} className={styles.cardWrapper}>
                      <TestimonialCard quote={t.quote} author={t.author} role={t.role} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className={styles.controls}>
            <button aria-label="Previous testimonials" className={styles.controlBtn} onClick={prev}>
              ‹
            </button>
            <div className={styles.dots}>
              {slides.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`${styles.dot} ${i === index ? styles.activeDot : ''}`}
                  onClick={() => goTo(i)}
                />
              ))}
            </div>
            <button aria-label="Next testimonials" className={styles.controlBtn} onClick={next}>
              ›
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}