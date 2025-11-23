// backend/config/categoryMap.js (FILE BARU)

// ⚠️ GANTI PLACEHOLDER INI DENGAN OBJECT ID ASLI DARI DB MONGODB KAMU
const CATEGORY_MAPPING = {
    FRUIT_JUICE: '6918c1644af61a4dfb043771',
    MINERAL_WATER: '6918ccb8b6be798e8a6a971e',
    SNACK: '6918ccfbb6be798e8a6a9720',
    FRUIT: '6922dadd7bcacd617e9ff3b1',
    DEFAULT: '' 
};

const determineCategory = (productName) => {
    if (!productName) return CATEGORY_MAPPING.DEFAULT;

    const name = productName.toUpperCase();

    // Logika Pintar: Cek keyword di nama produk
    if (name.includes('AQUA') || name.includes('AIR MIN')) {
        return CATEGORY_MAPPING.WATER;
    }
    if (name.includes('BASRENG') || name.includes('KERUPUK') || name.includes('CHIPS')) {
        return CATEGORY_MAPPING.SNACK;
    }
    if (name.includes('POTONG') || name.includes('SEGAR') || name.includes('BUAH')) {
        return CATEGORY_MAPPING.FRUIT;
    }
    if (name.includes('JUS') || name.includes('BLENDA') || name.includes('SMOOTHIE')) {
        return CATEGORY_MAPPING.JUICE;
    }
    
    return CATEGORY_MAPPING.DEFAULT; 
};

module.exports = { determineCategory };