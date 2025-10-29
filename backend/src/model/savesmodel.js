const mongoose = require('mongoose');

const savesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodModel',
        required: true,
    },
}, {
    timestamps: true,
    indexes: [
        // ensure unique save per user-food pair
    ]
});

// Create a compound unique index to prevent duplicate saves
savesSchema.index({ userId: 1, foodId: 1 }, { unique: true });

const Saves = mongoose.model('Saves', savesSchema);
module.exports = Saves;


