const express = require('express');
const router = express.Router(); 

const EnergyCalculation = require('../models/energyCalculator');

router.post('/calculate-energy', async (req, res) => {
    const { amps, voltage, hoursPerDay, costPerKwh } = req.body;

    // Validate that all required fields are present
    if (!amps || !voltage || !hoursPerDay || !costPerKwh) {
        return res.status(400).json({ message: 'All fields are required: amps, voltage, hours per day, and cost per kWh.' });
    }

    try {
        // Calculate power and energy consumption
        const power = amps * voltage;
        const energyConsumed = (power / 1000) * hoursPerDay;
        const totalCost = energyConsumed * costPerKwh;

        // Save calculation to the database
        const calculation = new EnergyCalculation({
            amps,
            voltage,
            hoursPerDay,
            costPerKwh,
            energyConsumed: energyConsumed.toFixed(2),
            totalCost: totalCost.toFixed(2),
        });

        await calculation.save();

        // Send the response with the calculated total cost
        res.status(200).json({
            totalCost: totalCost.toFixed(2),
            message: 'Calculation successful'
        });

    } catch (error) {
        // Handle server errors and respond with an appropriate message
        res.status(500).json({ message: 'Server error during energy calculation', error: error.message });
    }
});

module.exports = router;
