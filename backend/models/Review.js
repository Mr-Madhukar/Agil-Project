const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    created_at: { type: Date, default: Date.now }
});

reviewSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Review', reviewSchema);
