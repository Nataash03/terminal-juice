// frontend/app/about/page.tsx

import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import TestimonialCard from '../components/TestimonialCard';
import styles from './AboutPage.module.css';

// 1. DEFINISI TIPE DATA UNTUK ITEM TESTIMONIAL
interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
}

const testimonialsData: TestimonialItem[] = [ // Terapkan tipe data di sini
  // Tambahkan data agar totalnya >= 8 untuk melihat 2 slide penuh
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
  { 
    quote: "The turmeric shots are a game-changer! Fantastic immunity boost and the taste is surprisingly smooth. Highly recommend!", 
    author: 'David Lee', 
    role: 'Freelance Designer' 
  },
  { 
    quote: "The packaging is chic and the taste is even better. My new favourite way to hydrate!", 
    author: 'Lily Adams', 
    role: 'Marketing Specialist' 
  },
  { 
    quote: "Best juice for detox, hands down! The flavors are unique and authentic. A must-buy.", 
    author: 'Tom Johnson', 
    role: 'Entrepreneur' 
  },
  { 
    quote: "Best juice for detox, hands down! The flavors are unique and authentic. A must-buy.", 
    author: 'Linsay L', 
    role: 'Staff' 
  },
  { 
    quote: "Best juice for detox, hands down! The flavors are unique and authentic. A must-buy.", 
    author: 'John Doe', 
    role: 'Entrepreneur' 
  },
  { 
    quote: "Best juice for detox, hands down! The flavors are unique and authentic. A must-buy.", 
    author: 'Jane Doe', 
    role: 'Entrepreneur' 
  },
];

// 2. FUNGSI CHUNK DENGAN TIPE DATA YANG BENAR
const chunk = (arr: TestimonialItem[], size: number): TestimonialItem[][] => {
  return arr.reduce((acc: TestimonialItem[][], _: any, i: number) => (
    i % size ? acc : [...acc, arr.slice(i, i + size)]
  ), []);
};

export default function AboutPage() {
  // 3. KELOMPOKKAN DATA MENJADI 4 KARTU PER SLIDE
  const slides = chunk(testimonialsData, 4);

  return (
    <div className={styles.aboutPageContainer}>
      {/* ... Bagian Who We Are ... */}

      {/* Bagian Testimonial */}
      <section className={styles.testimonialsSection}>
        
        {/* WRAPPER EMOJI DAN JUDUL */}
        <div className={styles.testimonialHeaderWrapper}>
          
          {/* EMOJI (POSITION ABSOLUTE DI CSS) */}
          <span className={styles.emoji}>🤩</span> 
          
          <h2 className={styles.testimonialTitle}>
            Our costumers <span className={styles.loveHighlight}>love us</span>
          </h2>
        </div>
        
        {/* CONTAINER CAROUSEL */}
        <div className={styles.testimonialCarouselContainer}> 
          <Carousel indicators={true} controls={false} interval={null}>
            
            {/* MAP DENGAN TIPE DATA YANG DIPERBAIKI */}
            {slides.map((slideGroup, index) => ( // Tidak ada error karena 'index' digunakan untuk 'key'
              // Setiap Carousel.Item adalah satu slide (berisi 4 kartu)
              <Carousel.Item key={index}>
                
                {/* 3. GRID UNTUK MENEMPATKAN 4 KARTU SECARA HORIZONTAL */}
                <div className={styles.cardGroup}> 
                  {slideGroup.map((t, cardIndex) => ( // Tidak ada error karena 'cardIndex' digunakan untuk 'key'
                    <div key={cardIndex} className={styles.cardWrapper}>
                      <TestimonialCard 
                        quote={t.quote}
                        author={t.author}
                        role={t.role}
                      />
                    </div>
                  ))}
                </div>
                
              </Carousel.Item>
            ))}
            
          </Carousel>
        </div>
        
      </section>
    </div>
  );
}