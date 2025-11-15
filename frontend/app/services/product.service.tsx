// Product Service (Mock Data)

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
    // Best Sellers (Juice)
    { id: 1, name: 'Jus Melon', price: 35000, imageSrc: '/images/juice melon.png', bgColor: '#C8E6C9', description: 'Fresh celery and spinach mix.', category: 'Juice', tags: ['best_seller'] },
    { id: 2, name: 'Jus Mangga', price: 30000, imageSrc: '/images/juice mangga.png', bgColor: '#FFE0B2', description: 'Sweet mango and passion fruit blend.', category: 'Juice', tags: ['best_seller'] },
    { id: 3, name: 'Jus Strawberry', price: 32000, imageSrc: '/images/juice strawberry.png', bgColor: '#FFCDD2', description: 'Creamy strawberry delight.', category: 'Juice', tags: ['best_seller'] },
    { id: 4, name: 'Jus Nanas', price: 28000, imageSrc: '/images/juice nanas.png', bgColor: '#FFF9C4', description: 'Orange, lemon, and a hint of ginger.', category: 'Juice', tags: ['best_seller'] },
    { id: 5, name: 'Jus Alpukat', price: 38000, imageSrc: '/images/juice alpukat.png', bgColor: '#DCEDC8', description: 'Rich avocado and almond milk.', category: 'Juice', tags: ['best_seller'] },
    { id: 6, name: 'Jus Mix 2 in 1', price: 35000, imageSrc: '/images/juice mix 2 in 1.png', bgColor: '#BBDEFB', description: 'Blueberry, raspberry, and kale.', category: 'Juice', tags: ['best_seller'] },
  
    // All Menu (Juice - sisanya)
    { id: 7, name: 'Beetroot Power', price: 33000, imageSrc: '/images/product_beetroot.png', bgColor: '#F8BBD0', description: 'Earthy beetroot and apple.', category: 'Juice', tags: ['new_item'] },
    { id: 8, name: 'Guava Sunset', price: 29000, imageSrc: '/images/product_guava.png', bgColor: '#F0F4C3', description: 'Light and refreshing guava juice.', category: 'Juice', tags: [] },
  
    // Other (Fruit)
    { id: 9, name: 'Mango Slice', price: 10000, imageSrc: '/images/mangga potong.webp', bgColor: '#DCE775', description: 'Honeydew and Cantaloupe mix.', category: 'Fruit', tags: [] },
    { id: 10, name: 'Strawberry Slice', price: 10000, imageSrc: '/images/stroberi potong.jpg', bgColor: '#FFF176', description: 'Sweet and sour fresh pineapple.', category: 'Fruit', tags: [] },
    { id: 11, name: 'Mix Fruit Slices', price: 15000, imageSrc: '/images/buah potong.png', bgColor: '#FF6B6B', description: 'Sweet and sour fresh pineapple.', category: 'Fruit', tags: [] },
  
    // Other (Mineral Water)
    { id: 12, name: 'Premium Mineral Water 600 ml', price: 5000, imageSrc: '/images/aqua 600.png', bgColor: '#B3E5FC', description: 'High quality mineral water.', category: 'Mineral Water', tags: [] },
    { id: 13, name: 'Premium Mineral Water 1500 ml', price: 8000, imageSrc: '/images/aqua 1500.png', bgColor: '#B3E5FC', description: 'High quality mineral water.', category: 'Mineral Water', tags: [] },
  
    // Other (Snacks)
    { id: 14, name: 'Basreng', price: 10000, imageSrc: '/images/basreng.webp', bgColor: '#E6EE9C', description: 'Healthy oatmeal bar with nuts.', category: 'Snacks', tags: [] },
  ];
  
  // Fungsi mock untuk mendapatkan semua produk
  export const getProducts = async (): Promise<JuiceProduct[]> => {
    // Simulasikan penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Mengembalikan data mock
    return mockProducts;
  };