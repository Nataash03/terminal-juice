'use client';

import React, { useEffect, useRef, useState } from 'react';
import TestimonialCard from '../components/TestimonialCard';
import AddReviewForm from '../components/AddReviewForm';
import styles from './AboutPage.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

interface TestimonialItem {
  _id?: string;  
  userId?: string; 
  quote: string;
  author: string;
  role: string;
  rating?: number;
}

const defaultTestimonials: TestimonialItem[] = [
  { quote: "I've tried countless juice brands, but terminal juice truly stands out.", author: 'Angel', role: 'Economic Bussiness Student', rating: 5 },
  { quote: "The natural ingredients and amazing taste make it easy to stay hydrated.", author: 'Marcus', role: 'Engineering Student', rating: 5 },
  { quote: "Great pick me up! The ginger yuzu flavor is perfect after my morning class.", author: 'Sarah', role: 'IT Staff', rating: 5 },
  { quote: "The avocado are a game-changer! Fantastic immunity boost.", author: 'David', role: 'Arts Student', rating: 5 },
  { quote: "My new favourite way to hydrate!", author: 'Eva', role: 'Marketing Team', rating: 5 },
  { quote: "Best juice for detox, hands down! The flavors are unique and authentic.", author: 'Eka', role: 'Law Student', rating: 5 },
  { quote: "Absolutely the perfect juice for a fresh detox! Worth every sip!", author: 'Lily', role: 'IT Student', rating: 5 },
  { quote: "Top-tier detox juice! Flavor-nya rich dan alami banget.", author: 'Zahra', role: 'Medical Student', rating: 5 },
  { quote: "One of the best detox juices I’ve tried! Seger dan bikin nagih.", author: 'Gilbert', role: 'Pyschology Student', rating: 5 }
];

const chunk = (arr: TestimonialItem[], size: number): TestimonialItem[][] => {
  const out: TestimonialItem[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
};

export default function AboutPage() {
  const [dbReviews, setDbReviews] = useState<TestimonialItem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null); 

  const testimonials = [...dbReviews, ...defaultTestimonials];

  const [index, setIndex] = useState(0);
  const slides = chunk(testimonials, 4); 
  const slidesCount = slides.length;

  const startX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        try {
            setCurrentUser(JSON.parse(storedUser));
        } catch (e) {
            console.error("Gagal parsing user data");
        }
    }

    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews`);
        if (!res.ok) throw new Error('Gagal ambil data');
        
        const data = await res.json();
        setDbReviews(data); 
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleAddReview = async (newReview: any) => {
    const payload = {
        ...newReview,
        userId: currentUser?._id 
    };

    try {
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const savedReview = await res.json();
            setDbReviews(prev => [savedReview, ...prev]); 
            setIndex(0); 
        } else {
            alert("Gagal mengirim review.");
        }
    } catch (error) {
        console.error("Error posting review:", error);
        alert("Server error.");
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Yakin mau hapus review ini?")) return;

    try {
        const res = await fetch(`${API_URL}/api/reviews/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setDbReviews(prev => prev.filter(r => r._id !== id));
            alert("Review berhasil dihapus.");
        } else {
            alert("Gagal menghapus review.");
        }
    } catch (error) {
        alert("Error koneksi saat menghapus.");
    }
  };

  const handleEditReview = async (id: string) => {
    const oldData = dbReviews.find(r => r._id === id);
    if (!oldData) return;

    const newQuote = prompt("Edit komentar kamu:", oldData.quote);
    if (newQuote === null || newQuote.trim() === "") return; 

    const newRatingStr = prompt("Edit rating (1-5):", String(oldData.rating));
    const newRating = Number(newRatingStr);
    
    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
        alert("Rating harus angka 1-5");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/reviews/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quote: newQuote, rating: newRating })
        });

        if (res.ok) {
            const updatedReview = await res.json();
            setDbReviews(prev => prev.map(r => r._id === id ? updatedReview : r));
            alert("Review berhasil diupdate!");
        } else {
            alert("Gagal update review.");
        }
    } catch (error) {
        alert("Error koneksi saat update.");
    }
  };

  const prev = () => setIndex((i) => (i - 1 + slidesCount) % slidesCount);
  const next = () => setIndex((i) => (i + 1) % slidesCount);
  const goTo = (i: number) => setIndex(Math.max(0, Math.min(i, slidesCount - 1)));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [slidesCount]);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const delta = startX.current - e.changedTouches[0].clientX;
    if (delta > 40) next(); 
    if (delta < -40) prev(); 
    startX.current = null;
  };

  return (
    <div className={styles.aboutPageContainer}>
      
      {/* Who We Are */}
      <section className={styles.whoSection}>
         <div className={styles.whoLeft}>
            <h1>Who we are?</h1>
            <p>We’re a team of four students coding our way through this project. Our website isn’t <strong>ju(ice)st</strong> functional—it’s crafted with <strong>creativity, teamwork, and a splash of fun!</strong></p>
            <p>Every bottle tells a story of dedication, sustainability, and a genuine love for nature's bounty.</p>
         </div>
         <div className={styles.whoRight}>
            <img src="/images/who-are-we.png" alt="Fruits" className={styles.whoImg} />
         </div>
      </section>

      {/* Testimonial */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialHeaderWrapper}>
          <span className={styles.emoji}>🤩</span>
          <h2 className={styles.testimonialTitle}>
            Our customers <span className={styles.loveHighlight}>love us</span>
          </h2>
        </div>

        {/* Form Add Review */}
        <div style={{marginTop: '20px'}}>
             <AddReviewForm onSubmit={handleAddReview} />
        </div>

        {/* Carousel*/}
        <div 
            className={styles.testimonialCarouselContainer} 
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
        >
          <div
            className={styles.slidesContainer}
            style={{ width: `${slidesCount * 100}%`, transform: `translateX(-${index * (100 / slidesCount)}%)` }}
          >
            {slides.map((group, sIdx) => (
              <div key={sIdx} className={styles.slide}>
                <div className={styles.cardGroup}>
                  {group.map((t, cardIndex) => (
                    <div key={cardIndex} className={styles.cardWrapper}>
                      <TestimonialCard 
                          id={t._id}
                          quote={t.quote} 
                          author={t.author} 
                          role={t.role} 
                          rating={t.rating || 5} 
                        
                          isOwner={!!currentUser && !!t.userId && currentUser._id === t.userId}
                          
                          onEdit={handleEditReview}
                          onDelete={handleDeleteReview}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Controls */}
          <div className={styles.controls}>
             <button className={styles.controlBtn} onClick={prev}>‹</button>
             <div className={styles.dots}>
               {slides.map((_, i) => (
                 <button 
                    key={i} 
                    className={`${styles.dot} ${i === index ? styles.activeDot : ''}`} 
                    onClick={() => goTo(i)} 
                 />
               ))}
             </div>
             <button className={styles.controlBtn} onClick={next}>›</button>
          </div>
        </div>
      </section>
    </div>
  );
}