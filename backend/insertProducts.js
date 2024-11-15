const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const Product = require('./models/productModel');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
        insertData();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

// Sample product data with `modelNumber`, `voltage`, and `amp`
const products = [
    // TV products
    {
        title: 'Amazon Fire TV',
        description: 'Amazon Fire TV with HDR 10 and 4K UHD quality.',
        image: '/assets/tv1.jpg',
        price: 499.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'AMZN-FIRE-4K',
        voltage: 110,
        amp: 1.5,
    },
    {
        title: 'LG UHD AI ThinQ',
        description: 'LG UHD AI ThinQ with stunning color display and smart features.',
        image: '/assets/tv2.jpg',
        price: 699.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'LG-UHD-THINQ',
        voltage: 110,
        amp: 1.8,
    },
    {
        title: 'LG OLED',
        description: 'LG OLED TV with vibrant colors and OLED display technology.',
        image: '/assets/tv3.jpg',
        price: 1199.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'LG-OLED-55',
        voltage: 110,
        amp: 2.2,
    },
    {
        title: 'Philips 4K Ultra HD Roku TV',
        description: 'Philips 4K Ultra HD TV with Roku integration for seamless streaming.',
        image: '/assets/tv4.jpeg',
        price: 549.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'PHIL-4K-RK',
        voltage: 110,
        amp: 1.9,
    },
    {
        title: 'Hisense VIDAA TV',
        description: 'Hisense VIDAA TV with built-in streaming apps and Full HD display.',
        image: '/assets/tv5.jpeg',
        price: 299.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'HIS-VIDAA-FHD',
        voltage: 110,
        amp: 1.3,
    },
    {
        title: 'Samsung Crystal UHD',
        description: 'Samsung Crystal UHD TV with lifelike colors and powerful performance.',
        image: '/assets/tv6.jpeg',
        price: 799.99,
        category: 'TV',
        stock_quantity: 10,
        modelNumber: 'SAMS-CRYSTAL-UHD',
        voltage: 110,
        amp: 2.0,
    },
    // Bulb products
    {
        title: 'HomeMate Smart Bulb',
        description: 'HomeMate 9W Smart Bulb with voice control and app connectivity.',
        image: '/assets/bulb1.jpg',
        price: 19.99,
        category: 'Bulb',
        stock_quantity: 10,
        modelNumber: 'HM-SMART-9W',
        voltage: 220,
        amp: 0.04,
    },
    {
        title: 'Luminus LED Bulb',
        description: 'Luminus 60W LED Bulb with adjustable brightness and long lifespan.',
        image: '/assets/bulb2.jpg',
        price: 9.99,
        category: 'Bulb',
        stock_quantity: 10,
        modelNumber: 'LUM-LED-60W',
        voltage: 220,
        amp: 0.27,
    },
    {
        title: 'Sylvania LED Bulb',
        description: 'Sylvania 100W Soft White LED Bulb, energy-saving and long-lasting.',
        image: '/assets/bulb3.png',
        price: 14.99,
        category: 'Bulb',
        stock_quantity: 10,
        modelNumber: 'SYL-LED-100W',
        voltage: 220,
        amp: 0.45,
    },
    // Doorbell products
    {
        title: 'Smatrol Smart Doorbell',
        description: 'Smatrol Smart Doorbell with no battery required and LED indicator.',
        image: '/assets/doorbell1.jpg',
        price: 49.99,
        category: 'Door Bell',
        stock_quantity: 10,
        modelNumber: 'SMATROL-DB',
        voltage: 110,
        amp: 0.5,
    },
    {
        title: 'Mubview Video Doorbell',
        description: 'Mubview video doorbell with motion detection and mobile notifications.',
        image: '/assets/doorbell2.jpg',
        price: 129.99,
        category: 'Door Bell',
        stock_quantity: 10,
        modelNumber: 'MUBVIEW-VD',
        voltage: 110,
        amp: 0.7,
    },
    {
        title: 'Smart Doorbell with Easy Installation',
        description: 'Easy to install smart doorbell with night vision and two-way audio.',
        image: '/assets/doorbell3.jpeg',
        price: 89.99,
        category: 'Door Bell',
        stock_quantity: 10,
        modelNumber: 'SMART-EASY-DB',
        voltage: 110,
        amp: 0.6,
    },
    {
        title: 'ENER-J Smart Video Doorbell',
        description: 'ENER-J video doorbell with HD camera and mobile app integration.',
        image: '/assets/doorbell4.jpg',
        price: 139.99,
        category: 'Door Bell',
        stock_quantity: 10,
        modelNumber: 'ENERJ-SVD',
        voltage: 110,
        amp: 0.75,
    },
    {
        title: 'Ecobee Smart Doorbell',
        description: 'Ecobee smart doorbell with high-quality camera and smart home integration.',
        image: '/assets/doorbell5.jpg',
        price: 149.99,
        category: 'Door Bell',
        stock_quantity: 10,
        modelNumber: 'ECOBEE-SMART-DB',
        voltage: 110,
        amp: 0.8,
    },

];

// Function to insert data into the database
const insertData = async () => {
    try {
        await Product.insertMany(products);
        console.log('Sample products inserted successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error inserting data:', error);
        mongoose.connection.close();
    }
};
