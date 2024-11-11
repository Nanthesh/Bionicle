const mongoose = require('mongoose');

const energyCalculationSchema = new mongoose.Schema({
    amps: {
        type: Number,
        required: true,
    },
    voltage: {
        type: Number,
        required: true,
    },
    hoursPerDay: {
        type: Number,
        required: true,
    },
    costPerKwh: {
        type: Number,
        required: true,
    },
    energyConsumed: {
        type: Number,
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('EnergyCalculation', energyCalculationSchema);
