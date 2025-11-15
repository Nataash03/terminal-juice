// File: controllers/categoryController.js (Pastikan semua fungsi ada)

const Category = require('../models/Category');

// 1. GET all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET single category by ID (Dibutuhkan oleh router.get('/:id'))
exports.getCategoryById = async (req, res) => {
    // 💡 Placeholder: Kamu bisa melengkapi logikanya nanti
    res.status(501).json({ message: 'GET by ID Not Implemented Yet' }); 
};

// 3. POST create new category (Sudah kita buat sebelumnya)
exports.createCategory = async (req, res) => {
    try {
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: savedCategory
        });
    } catch (error) {
        // Ini akan menangani error jika 'name' atau 'slug' kosong
        res.status(400).json({
            success: false,
            message: 'Failed to create category',
            error: error.message
        });
    }
};

// 4. PUT update category (Dibutuhkan oleh router.put('/:id'))
exports.updateCategory = async (req, res) => {
    // 💡 Placeholder
    res.status(501).json({ message: 'PUT/Update Not Implemented Yet' }); 
};

// 5. DELETE category (Dibutuhkan oleh router.delete('/:id'))
exports.deleteCategory = async (req, res) => {
    // 💡 Placeholder
    res.status(501).json({ message: 'DELETE Not Implemented Yet' }); 
};