const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); 

// 1. GET ALL REVIEWS (Ambil semua review dari database)
router.get('/', async (req, res) => {
  try {
    // Ambil review, urutkan dari yang terbaru (descending)
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. CREATE REVIEW (Simpan review baru)
router.post('/', async (req, res) => {
  const { quote, author, role, rating, userId } = req.body;

  const newReview = new Review({
    quote,
    author,
    role: role || 'Verified Customer',
    rating,
    userId
  });

  try {
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. UPDATE REVIEW (PUT)
router.put('/:id', async (req, res) => {
  try {
    // Cari review berdasarkan ID dan update isinya
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
            quote: req.body.quote,
            rating: req.body.rating
        }
      },
      { new: true } 
    );
    
    if (!updatedReview) return res.status(404).json({ message: "Review not found" });
    
    res.status(200).json(updatedReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. DELETE REVIEW (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    
    if (!deletedReview) return res.status(404).json({ message: "Review not found" });
    
    res.status(200).json({ message: "Review has been deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;