const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables

const Product = require('./models/productModel'); // Adjust the path if needed

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

// Sample product data
const products = [
    // TV products
    {
        title: 'Amazon Fire TV',
        description: 'Amazon Fire TV with HDR 10 and 4K UHD quality.',
        image: '/assets/tv1.jpg',
        price: 499.99,
        category: 'TV',
        stock_quantity: 10
    },
    {
        title: 'LG UHD AI ThinQ',
        description: 'LG UHD AI ThinQ with stunning color display and smart features.',
        image: '/assets/tv2.jpg',
        price: 699.99,
        category: 'TV',
        stock_quantity: 10
    },
    {
        title: 'LG OLED',
        description: 'LG OLED TV with vibrant colors and OLED display technology.',
        image: '/assets/tv3.jpg',
        price: 1199.99,
        category: 'TV',
        stock_quantity: 10
    },
    {
        title: 'Philips 4K Ultra HD Roku TV',
        description: 'Philips 4K Ultra HD TV with Roku integration for seamless streaming.',
        image: '/assets/tv4.jpeg',
        price: 549.99,
        category: 'TV',
        stock_quantity: 10
    },
    {
        title: 'Hisense VIDAA TV',
        description: 'Hisense VIDAA TV with built-in streaming apps and Full HD display.',
        image: '/assets/tv5.jpeg',
        price: 299.99,
        category: 'TV',
        stock_quantity: 10
    },
    {
        title: 'Samsung Crystal UHD',
        description: 'Samsung Crystal UHD TV with lifelike colors and powerful performance.',
        image: '/assets/tv6.jpeg',
        price: 799.99,
        category: 'TV',
        stock_quantity: 10
    },
    // Bulb products
    {
        title: 'HomeMate Smart Bulb',
        description: 'HomeMate 9W Smart Bulb with voice control and app connectivity.',
        image: '/assets/bulb1.jpg',
        price: 19.99,
        category: 'Bulb',
        stock_quantity: 10
    },
    {
        title: 'Luminus LED Bulb',
        description: 'Luminus 60W LED Bulb with adjustable brightness and long lifespan.',
        image: '/assets/bulb2.jpg',
        price: 9.99,
        category: 'Bulb',
        stock_quantity: 10
    },
    {
        title: 'Sylvania LED Bulb',
        description: 'Sylvania 100W Soft White LED Bulb, energy-saving and long-lasting.',
        image: '/assets/bulb3.png',
        price: 14.99,
        category: 'Bulb',
        stock_quantity: 10
    },
    // Doorbell products
    {
        title: 'Smatrol Smart Doorbell',
        description: 'Smatrol Smart Doorbell with no battery required and LED indicator.',
        image: '/assets/doorbell1.jpg',
        price: 49.99,
        category: 'Door Bell',
        stock_quantity: 10
    },
    {
        title: 'Mubview Video Doorbell',
        description: 'Mubview video doorbell with motion detection and mobile notifications.',
        image: '/assets/doorbell2.jpg',
        price: 129.99,
        category: 'Door Bell',
        stock_quantity: 10
    },
    {
        title: 'Smart Doorbell with Easy Installation',
        description: 'Easy to install smart doorbell with night vision and two-way audio.',
        image: '/assets/doorbell3.jpeg',
        price: 89.99,
        category: 'Door Bell',
        stock_quantity: 10
    },
    {
        title: 'ENER-J Smart Video Doorbell',
        description: 'ENER-J video doorbell with HD camera and mobile app integration.',
        image: '/assets/doorbell4.jpg',
        price: 139.99,
        category: 'Door Bell',
        stock_quantity: 10
    },
    {
        title: 'Ecobee Smart Doorbell',
        description: 'Ecobee smart doorbell with high-quality camera and smart home integration.',
        image: '/assets/doorbell5.jpg',
        price: 149.99,
        category: 'Door Bell',
        stock_quantity: 10
    }
];

// Function to insert data into the database
const insertData = async () => {
    try {
        await Product.insertMany(products);
        console.log('Sample products inserted successfully');
        mongoose.connection.close(); // Close connection after insertion
    } catch (error) {
        console.error('Error inserting data:', error);
        mongoose.connection.close(); // Close connection on error
    }
};
