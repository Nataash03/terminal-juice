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
    { id: 1, name: 'Green Detox Blast', price: 35000, imageSrc: '/images/product_green.png', bgColor: '#C8E6C9', description: 'Fresh celery and spinach mix.', category: 'Juice', tags: ['best_seller'] },
    { id: 2, name: 'Tropical Mango', price: 30000, imageSrc: '/images/product_mango.png', bgColor: '#FFE0B2', description: 'Sweet mango and passion fruit blend.', category: 'Juice', tags: ['best_seller'] },
    { id: 3, name: 'Strawberry Heaven', price: 32000, imageSrc: '/images/product_strawberry.png', bgColor: '#FFCDD2', description: 'Creamy strawberry delight.', category: 'Juice', tags: ['best_seller'] },
    { id: 4, name: 'Citrus Zest', price: 28000, imageSrc: '/images/product_citrus.png', bgColor: '#FFF9C4', description: 'Orange, lemon, and a hint of ginger.', category: 'Juice', tags: ['best_seller'] },
    { id: 5, name: 'Avocado Energy', price: 38000, imageSrc: '/images/product_avocado.png', bgColor: '#DCEDC8', description: 'Rich avocado and almond milk.', category: 'Juice', tags: ['best_seller'] },
    { id: 6, name: 'Berry Antioxidant', price: 35000, imageSrc: '/images/product_berry.png', bgColor: '#BBDEFB', description: 'Blueberry, raspberry, and kale.', category: 'Juice', tags: ['best_seller'] },
  
    // All Menu (Juice - sisanya)
    { id: 7, name: 'Beetroot Power', price: 33000, imageSrc: '/images/product_beetroot.png', bgColor: '#F8BBD0', description: 'Earthy beetroot and apple.', category: 'Juice', tags: ['new_item'] },
    { id: 8, name: 'Guava Sunset', price: 29000, imageSrc: '/images/product_guava.png', bgColor: '#F0F4C3', description: 'Light and refreshing guava juice.', category: 'Juice', tags: [] },
  
    // Other (Fruit)
    { id: 9, name: 'Fresh Cut Melon', price: 20000, imageSrc: '/images/product_melon.png', bgColor: '#DCE775', description: 'Honeydew and Cantaloupe mix.', category: 'Fruit', tags: [] },
    { id: 10, name: 'Sliced Pineapple', price: 18000, imageSrc: '/images/product_pineapple.png', bgColor: '#FFF176', description: 'Sweet and sour fresh pineapple.', category: 'Fruit', tags: [] },
  
    // Other (Mineral Water)
    { id: 11, name: 'Premium Mineral Water 600ml', price: 8000, imageSrc: '/images/product_water.png', bgColor: '#B3E5FC', description: 'High quality mineral water.', category: 'Mineral Water', tags: [] },
  
    // Other (Snacks)
    { id: 12, name: 'Oatmeal Energy Bar', price: 15000, imageSrc: '/images/product_oatmeal.png', bgColor: '#E6EE9C', description: 'Healthy oatmeal bar with nuts.', category: 'Snacks', tags: [] },
    { id: 13, name: 'Assorted Nuts Pouch', price: 25000, imageSrc: '/images/product_nuts.png', bgColor: '#D7CCC8', description: 'Cashews, almonds, and walnuts.', category: 'Snacks', tags: [] },
  ];
  
  // Fungsi mock untuk mendapatkan semua produk
  export const getProducts = async (): Promise<JuiceProduct[]> => {
    // Simulasikan penundaan jaringan
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    // Mengembalikan data mock
    return mockProducts;
  };