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
    { id: 1, name: 'Pineapple Delight', price: 20000, imageSrc: '/images/product-pineapple.png', bgColor: '#fdd854' },
    { id: 2, name: 'Strawberry Blast', price: 25000, imageSrc: '/images/product-strawberry.png', bgColor: '#ffcdd2' },
    { id: 3, name: 'Melon Mint', price: 18000, imageSrc: '/images/product-melon.png', bgColor: '#e8f5e9' },
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