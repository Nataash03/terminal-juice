export interface JuiceProduct {
    id: number;
    name: string;
    price: number;
    imageSrc: string;
    bgColor?: string;
    description: string;
    category: 'Juice' | 'Fruit' | 'Mineral Water' | 'Snacks';
    tags: ('best_seller' | 'new_item' | 'featured')[];
  }
  
  const mockProducts: JuiceProduct[] = [
    { id: 1, name: 'Jus Melon', price: 15000, imageSrc: '/images/juice melon.png', bgColor: '#C8E6C9', description: 'Fresh celery and spinach mix.', category: 'Juice', tags: ['best_seller'] },
    { id: 2, name: 'Jus Mangga', price: 20000, imageSrc: '/images/juice mangga.png', bgColor: '#FFE0B2', description: 'Sweet mango and passion fruit blend.', category: 'Juice', tags: ['best_seller'] },
    { id: 3, name: 'Jus Strawberry', price: 15000, imageSrc: '/images/juice strawberry.png', bgColor: '#FFCDD2', description: 'Creamy strawberry delight.', category: 'Juice', tags: ['best_seller'] },
    { id: 4, name: 'Jus Nanas', price: 15000, imageSrc: '/images/juice nanas.png', bgColor: '#FFF9C4', description: 'Orange, lemon, and a hint of ginger.', category: 'Juice', tags: ['best_seller'] },
    { id: 5, name: 'Jus Alpukat', price: 20000, imageSrc: '/images/juice alpukat.png', bgColor: '#DCEDC8', description: 'Rich avocado and almond milk.', category: 'Juice', tags: ['best_seller'] },
    { id: 6, name: 'Jus Mix 2 in 1', price: 35000, imageSrc: '/images/juice mix 2 in 1.png', bgColor: '#BBDEFB', description: 'Blueberry, raspberry, and kale.', category: 'Juice', tags: ['best_seller'] },
    { id: 7, name: 'Jus Blewah', price: 15000, imageSrc: '/images/juice blewah.png', bgColor: '#F8BBD0', description: 'Earthy beetroot and apple.', category: 'Juice', tags: ['new_item'] },
    { id: 8, name: 'Jus Jambu', price: 15000, imageSrc: '/images/juice jambu.png', bgColor: '#F0F4C3', description: 'Light and refreshing guava juice.', category: 'Juice', tags: [] },
  ];
  
  // Fungsi mock untuk mendapatkan semua produk
  export const getProducts = async (): Promise<JuiceProduct[]> => {
    // Simulasikan penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Mengembalikan data mock
    return mockProducts;
  };