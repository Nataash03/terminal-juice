// frontend/app/(main)/page.tsx

// 1. Import komponen HeroSection dari lokasi components
import HeroSection from './components/HeroSection';

/**
 * Halaman utama (Home Page) aplikasi.
 * Halaman ini akan secara otomatis dibungkus oleh Navbar dan Footer 
 * yang sudah kita atur di file layout.tsx.
 */
const HomePage = () => {
  return (
    <>
      {/* 2. Panggil (Render) komponen HeroSection */}
      <HeroSection />
      
      {/* Anda bisa menambahkan konten halaman utama lainnya di sini */}
    </>
  );
};

export default HomePage;