const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const Product = require('./models/Product');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Sample data
const sampleProducts = [
  // Electronics
  {
    name: 'iPhone 13 Pro',
    description: 'Apple iPhone 13 Pro with A15 Bionic chip and Pro camera system',
    price: 999.99,
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 50
  },
  {
    name: 'MacBook Air M2',
    description: 'Thin, light laptop with M2 chip and all-day battery life',
    price: 1199.99,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 30
  },
  {
    name: 'Sony WH-1000XM4',
    description: 'Industry-leading noise canceling wireless headphones',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 100
  },
  {
    name: 'Samsung Galaxy S22',
    description: 'Premium Android smartphone with advanced camera and display technology',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 45
  },
  {
    name: 'iPad Pro 12.9"',
    description: 'Powerful tablet with Liquid Retina XDR display and M1 chip',
    price: 1099.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 35
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Enhanced gaming console with vibrant 7-inch OLED screen',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1614925379192-9e99c8de0fe2?w=400&auto=format&fit=crop',
    category: 'Electronics',
    stock: 25
  },
  
  // Fashion
  {
    name: 'Casual Denim Jacket',
    description: 'Classic denim jacket for everyday wear',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&auto=format&fit=crop',
    category: 'Fashion',
    stock: 75
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with responsive cushioning',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop',
    category: 'Fashion',
    stock: 120
  },
  {
    name: 'Leather Crossbody Bag',
    description: 'Elegant genuine leather crossbody bag with adjustable strap',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&auto=format&fit=crop',
    category: 'Fashion',
    stock: 60
  },
  {
    name: 'Wool Winter Coat',
    description: 'Premium wool blend coat perfect for cold weather',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&auto=format&fit=crop',
    category: 'Fashion',
    stock: 45
  },
  {
    name: 'Vintage Sunglasses',
    description: 'Retro-inspired sunglasses with UV protection',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&auto=format&fit=crop',
    category: 'Fashion',
    stock: 90
  },
  
  // Home & Kitchen
  {
    name: 'Smart Coffee Maker',
    description: 'Programmable coffee maker with smartphone control',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1520970519539-6b0ac028c3f6?w=400&auto=format&fit=crop',
    category: 'Home',
    stock: 45
  },
  {
    name: 'Robot Vacuum',
    description: 'Smart robot vacuum with mapping technology',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1518384401463-d3876163c195?w=400&auto=format&fit=crop',
    category: 'Home',
    stock: 30
  },
  {
    name: 'Air Fryer Pro',
    description: 'Digital air fryer with multiple cooking functions',
    price: 119.99,
    image: 'https://images.unsplash.com/photo-1626228513260-adaa3bd860f7?w=400&auto=format&fit=crop',
    category: 'Home',
    stock: 55
  },
  {
    name: 'Smart LED Lighting Kit',
    description: 'Customizable color-changing LED lighting system with smartphone control',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1611599537845-1c7aca0091c0?w=400&auto=format&fit=crop',
    category: 'Home',
    stock: 70
  },
  {
    name: 'Ceramic Cookware Set',
    description: 'Non-stick ceramic cookware set with 12 pieces',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1584984793889-6ac1bbe1a2b2?w=400&auto=format&fit=crop',
    category: 'Home',
    stock: 25
  },
  
  // Books
  {
    name: 'Atomic Habits',
    description: 'James Clear\'s guide to building good habits and breaking bad ones',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&auto=format&fit=crop',
    category: 'Books',
    stock: 200
  },
  {
    name: 'The Psychology of Money',
    description: 'Morgan Housel\'s lessons on wealth, greed, and happiness',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1554377740-c148d9bbf0a4?w=400&auto=format&fit=crop',
    category: 'Books',
    stock: 180
  },
  {
    name: 'Dune',
    description: 'Frank Herbert\'s science fiction masterpiece',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1525855381163-7a36f14fa2a7?w=400&auto=format&fit=crop',
    category: 'Books',
    stock: 150
  },
  {
    name: 'The Midnight Library',
    description: 'Matt Haig\'s novel about life, regret, and second chances',
    price: 13.99,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&auto=format&fit=crop',
    category: 'Books',
    stock: 120
  },
  
  // Sports & Outdoors
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat for exercise and meditation',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1637666495972-22eb3484cf48?w=400&auto=format&fit=crop',
    category: 'Sports',
    stock: 150
  },
  {
    name: 'Mountain Bike',
    description: 'All-terrain mountain bike with suspension fork',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop',
    category: 'Sports',
    stock: 25
  },
  {
    name: 'Fitness Smartwatch',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&auto=format&fit=crop',
    category: 'Sports',
    stock: 80
  },
  {
    name: 'Tennis Racket Pro',
    description: 'Professional-grade tennis racket with graphite frame',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1593186674074-6cd7d76bc89c?w=400&auto=format&fit=crop',
    category: 'Sports',
    stock: 40
  },
  {
    name: 'Camping Tent 4-Person',
    description: 'Waterproof camping tent with easy setup for 4 people',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop',
    category: 'Sports',
    stock: 35
  },
  
  // Beauty & Personal Care
  {
    name: 'Facial Skincare Set',
    description: 'Complete skincare routine with cleanser, toner, and moisturizer',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&auto=format&fit=crop',
    category: 'Beauty',
    stock: 80
  },
  {
    name: 'Hair Dryer Brush',
    description: 'Volumizing hair dryer and hot air brush',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&auto=format&fit=crop',
    category: 'Beauty',
    stock: 65
  },
  {
    name: 'Luxury Perfume Collection',
    description: 'Set of 3 premium fragrances for all occasions',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1557170334-a9086d21c4d9?w=400&auto=format&fit=crop',
    category: 'Beauty',
    stock: 50
  },
  {
    name: 'Electric Shaver',
    description: 'Rechargeable electric shaver with precision trimmer',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=400&auto=format&fit=crop',
    category: 'Beauty',
    stock: 60
  },
  {
    name: 'Makeup Brush Set',
    description: 'Professional 15-piece makeup brush set with case',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop',
    category: 'Beauty',
    stock: 75
  },
  
  // New category: Toys & Games
  {
    name: 'LEGO Architecture Set',
    description: 'Detailed buildable model of famous architectural landmark',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&auto=format&fit=crop',
    category: 'Toys',
    stock: 40
  },
  {
    name: 'Board Game Collection',
    description: 'Set of 3 classic strategy board games for family game night',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&auto=format&fit=crop',
    category: 'Toys',
    stock: 30
  },
  {
    name: 'Remote Control Car',
    description: 'High-speed RC car with off-road capabilities',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1612892483236-52d32a0e0ac1?w=400&auto=format&fit=crop',
    category: 'Toys',
    stock: 55
  },
  
  // New category: Furniture
  {
    name: 'Modern Coffee Table',
    description: 'Minimalist coffee table with storage compartment',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1611486212355-d276af4581e3?w=400&auto=format&fit=crop',
    category: 'Furniture',
    stock: 20
  },
  {
    name: 'Ergonomic Office Chair',
    description: 'Comfortable adjustable office chair with lumbar support',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1589384267710-7a170981ca78?w=400&auto=format&fit=crop',
    category: 'Furniture',
    stock: 25
  },
  {
    name: 'Bookshelf with Drawers',
    description: 'Wooden bookshelf with 5 shelves and 2 storage drawers',
    price: 179.99,
    image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&auto=format&fit=crop',
    category: 'Furniture',
    stock: 15
  }
];

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Insert sample data
    await Product.bulkCreate(sampleProducts);
    console.log('Sample data inserted');
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
};

// Initialize the database when the server starts
sequelize.sync({ force: false }).then(async () => {
  try {
    const productCount = await Product.count();
    
    if (productCount === 0) {
      await initializeDatabase();
      console.log('Database initialized with sample data');
    } else {
      console.log('Database already contains data, skipping initialization');
    }
    
    // Start the server after database is initialized
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error initializing the database:', error);
  }
}); 