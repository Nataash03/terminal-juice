const CATEGORY_MAPPING = {
    FRUIT_JUICE: '6918c1644af61a4dfb043771',
    MINERAL_WATER: '6918ccb8b6be798e8a6a971e',
    SNACK: '6918ccfbb6be798e8a6a9720',
    FRUIT: '6922dadd7bcacd617e9ff3b1',
    DEFAULT: '6918c1644af61a4dfb043771' // Default ke Fruit Juice
};

const determineCategory = (productName) => {
    if (!productName) return CATEGORY_MAPPING.DEFAULT;

    const name = productName.toUpperCase();

    if (name.includes('AQUA') || name.includes('AIR MIN')) {
        return CATEGORY_MAPPING.MINERAL_WATER; 
    }
    
    if (name.includes('BASRENG') || name.includes('KERUPUK') || name.includes('CHIPS') || name.includes('SNACK')) {
        return CATEGORY_MAPPING.SNACK;
    }
    
    if (name.includes('POTONG') || name.includes('SEGAR')) {
        return CATEGORY_MAPPING.FRUIT;
    }
    
    if (name.includes('JUS') || name.includes('JUICE') || name.includes('BLENDA') || name.includes('SMOOTHIE') || name.includes('ALPUKAT') || name.includes('MANGGA') || name.includes('JERUK')) {
        return CATEGORY_MAPPING.FRUIT_JUICE; 
    }
    
    return CATEGORY_MAPPING.DEFAULT; 
};

module.exports = { CATEGORY_MAPPING, determineCategory };