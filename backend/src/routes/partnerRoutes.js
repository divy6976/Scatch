const express = require('express');
const FoodPartner = require('../model/foodpartner');
const FoodModel = require('../model/foodmodel');

const partnerRouter = express.Router();

// GET /api/v1/partner/:id/profile
// Returns partner public info and basic stats
partnerRouter.get('/:id/profile', async (req, res) => {
  try {
    const { id } = req.params;

    const partner = await FoodPartner.findById(id).select('name restaurantName email phone address createdAt');
    if (!partner) {
      return res.status(404).json({ message: 'Food partner not found' });
    }

    const [mealsCount, customersServed] = await Promise.all([
      FoodModel.countDocuments({ FoodPartner: id }),
      // Placeholder metric; adjust if you track customers explicitly
      FoodModel.countDocuments({ FoodPartner: id }).then((c) => c * 350),
    ]);

    return res.status(200).json({
      message: 'Partner profile fetched',
      data: {
        partner,
        stats: {
          totalMeals: mealsCount,
          customersServed,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// GET /api/v1/partner/:id/videos?page=&limit=
// Returns paginated list of partner videos
partnerRouter.get('/:id/videos', async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      FoodModel.find({ FoodPartner: id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      FoodModel.countDocuments({ FoodPartner: id }),
    ]);

    return res.status(200).json({
      message: 'Partner videos fetched',
      data: {
        items,
        pagination: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = partnerRouter;


