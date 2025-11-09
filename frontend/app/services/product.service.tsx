// frontend/app/services/product.service.ts

// Tipe data untuk produk jus
export interface JuiceProduct {
    id: number;
    name: string;
    price: number;
    imageSrc: string;
    bgColor?: string;
    description?: string;
}

// Data simulasi untuk Flavourpage
const mockProducts: JuiceProduct[] = [
    { id: 1, name: 'Juice mix 2 in 1', price: 15000, imageSrc: '/images/juice mix 2 in 1.png', bgColor: '#ffcdd2' },
    { id: 2, name: 'Juice mangga', price: 20000, imageSrc: '/images/juice mangga.png', bgColor: '#FFD166' },
    { id: 3, name: 'Juice melon', price: 15000, imageSrc: '/images/juice melon.png', bgColor: '#e8f5e9' },
];

/**
 * Simulasi fungsi untuk mengambil data produk.
 * Karena ini adalah Server Component, kita bisa menggunakan async/await.
 */

export const getProducts = async (): Promise<JuiceProduct[]> => {
    // Simulasi penundaan API
    await new Promise(resolve => setTimeout(resolve, 500)); 
    return mockProducts;
};