const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    package_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
    booking_date: { type: Date, default: Date.now },
    travel_date: { type: String, required: true },
    travelers: { type: Number, default: 1 },
    status: { type: String, default: 'Confirmed' }
});

bookingSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
