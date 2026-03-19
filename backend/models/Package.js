const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    price_inr: { type: String, required: true },
    price_usd: { type: String, required: true },
    rating: { type: Number, default: 0 },
    description: { type: String },
    image_url: { type: String },
    category: { type: String }
});

packageSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Package', packageSchema);
