// import express from 'express';
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const express = require("express");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    // In a production environment, you would use process.env.MONGODB_URI
    // Using a placeholder for development
    // await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Models
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true, enum: ['perfume', 'deodorant', 'body-spray'] },
  stock: { type: Number, required: true, default: 0 },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isAdmin: { type: Boolean, default: false },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  otpCode: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered'], default: 'pending' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' }
}, { timestamps: true });

// Initialize models
let Product, User, Order;

try {
  Product = mongoose.model('Product');
} catch {
  Product = mongoose.model('Product', ProductSchema);
}

try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', UserSchema);
}

try {
  Order = mongoose.model('Order');
} catch {
  Order = mongoose.model('Order', OrderSchema);
}

// Helper for OTP emails
const sendOtpEmail = async (email, otp) => {
  // In a production environment, configure a real email service
  console.log(`OTP for ${email}: ${otp}`);
  
  // Example with nodemailer (for development)
  try {
    // Create a test account for development purposes
    const testAccount = await nodemailer.createTestAccount();
    
    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    
    // Send email
    const info = await transporter.sendMail({
      from: '"Luxe Scent Boutique" <noreply@luxescent.com>',
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${otp}. It will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #c70000;">Luxe Scent Boutique</h2>
          <p>Your verification code is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; margin: 30px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
        </div>
      `
    });
    
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Email sending error:', error);
  }
};

// Middleware for token verification
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
  next();
};

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Find user or create a new one
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ email });
      await user.save();
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10 minutes
    
    // Save OTP to user
    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
    
    // Send OTP via email
    await sendOtpEmail(email, otp);
    
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    
    // Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if OTP is valid
    if (user.otpCode !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    
    // Check if OTP is expired
    if (new Date() > user.otpExpiry) {
      return res.status(401).json({ message: 'OTP expired' });
    }
    
    // Clear OTP
    user.otpCode = undefined;
    user.otpExpiry = undefined;
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        address: user.address
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User routes
app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const user = {
      _id: req.user._id,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      address: req.user.address
    };
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/address', authenticate, async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({ message: 'All address fields are required' });
    }
    
    // Update user address
    req.user.address = { street, city, state, zipCode, country };
    await req.user.save();
    
    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Product routes
app.get('/api/products', async (req, res) => {
  try {
    const { 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      search,
      featured,
      limit = 50
    } = req.query;
    
    // Build query
    const query = {};
    
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice) query.price = { $gte: parseFloat(minPrice) };
    if (maxPrice) {
      if (query.price) {
        query.price.$lte = parseFloat(maxPrice);
      } else {
        query.price = { $lte: parseFloat(maxPrice) };
      }
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (featured === 'true') query.featured = true;
    
    const mockProducts = [
      {
        _id: '1',
        name: 'Midnight Mystique',
        brand: 'Luxe Noir',
        description: 'A captivating blend of exotic spices and deep amber. This premium fragrance opens with vibrant top notes of bergamot and cardamom, followed by a heart of rich jasmine and iris. The base notes of amber, vanilla, and musk create a long-lasting scent that evolves throughout the day.',
        price: 89.99,
        image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 15,
        featured: true
      },
      {
        _id: '2',
        name: 'Golden Aura',
        brand: 'Éclat',
        description: 'Luxurious notes of jasmine, vanilla, and sandalwood blend harmoniously in this elegant fragrance. Golden Aura opens with bright citrus and bergamot, transitioning to a floral heart of jasmine and rose. The base notes of vanilla, sandalwood, and amber create a warm, lingering trail.',
        price: 75.50,
        oldPrice: 95.00,
        image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 8,
        featured: true
      },
      {
        _id: '3',
        name: 'Velvet Rose',
        brand: 'Opulence',
        description: 'An elegant composition featuring Bulgarian rose and patchouli. This sophisticated fragrance begins with sparkling notes of pink pepper and raspberry, followed by a heart of Bulgarian rose and peony. The base notes provide depth and sensuality.',
        price: 120.00,
        image: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 12,
        featured: true
      },
      {
        _id: '4',
        name: 'Ocean Breeze',
        brand: 'Aqua Vitae',
        description: 'Fresh and invigorating scent with notes of sea salt and citrus. Perfect for those who love clean, marine fragrances.',
        price: 65.00,
        image: 'https://images.pexels.com/photos/190333/pexels-photo-190333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'body-spray',
        stock: 20
      },
      {
        _id: '5',
        name: 'Arctic Chill',
        brand: 'Nordic',
        description: 'A cool, refreshing deodorant with long-lasting protection. Features crisp mint and eucalyptus notes.',
        price: 25.99,
        image: 'https://images.pexels.com/photos/5748755/pexels-photo-5748755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'deodorant',
        stock: 30
      },
      {
        _id: '6',
        name: 'Amber Woods',
        brand: 'Luxe Noir',
        description: 'Warm and woody scent perfect for evening occasions. A sophisticated blend of amber, cedarwood, and vanilla.',
        price: 95.00,
        image: 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 7
      },
      {
        _id: '7',
        name: 'Royal Oud',
        brand: 'Opulence',
        description: 'A majestic fragrance featuring rare oud wood, saffron, and rose. Perfect for special occasions.',
        price: 180.00,
        image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 5
      },
      {
        _id: '8',
        name: 'Summer Breeze',
        brand: 'Aqua Vitae',
        description: 'Light and refreshing body spray with notes of coconut, vanilla, and tropical flowers.',
        price: 45.00,
        image: 'https://images.pexels.com/photos/190333/pexels-photo-190333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'body-spray',
        stock: 25
      },
      {
        _id: '9',
        name: 'Fresh Pine',
        brand: 'Nordic',
        description: 'Invigorating deodorant with the crisp scent of pine needles and mountain air.',
        price: 22.99,
        image: 'https://images.pexels.com/photos/5748755/pexels-photo-5748755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'deodorant',
        stock: 40
      },
      {
        _id: '10',
        name: 'Citrus Splash',
        brand: 'Éclat',
        description: 'Energizing fragrance with notes of bergamot, lemon, and mandarin orange.',
        price: 85.00,
        image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 18
      },
      {
        _id: '11',
        name: 'Lavender Dreams',
        brand: 'Opulence',
        description: 'Calming and romantic fragrance featuring lavender, vanilla, and soft musk.',
        price: 110.00,
        image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 10
      },
      {
        _id: '12',
        name: 'Sport Fresh',
        brand: 'Nordic',
        description: 'Long-lasting deodorant perfect for active lifestyles. Features a clean, energetic scent.',
        price: 24.99,
        image: 'https://images.pexels.com/photos/5748755/pexels-photo-5748755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'deodorant',
        stock: 35
      }
    ];
    
    // Filter mock products based on query
    let filteredProducts = [...mockProducts];
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (brand) {
      filteredProducts = filteredProducts.filter(p => p.brand === brand);
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.brand.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (featured === 'true') {
      filteredProducts = filteredProducts.filter(p => p.featured === true);
    }
    
    // Apply limit
    if (limit) {
      filteredProducts = filteredProducts.slice(0, parseInt(limit));
    }
    
    res.status(200).json(filteredProducts);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // For development, return mock data
    const mockProducts = {
      '1': {
        _id: '1',
        name: 'Midnight Mystique',
        brand: 'Luxe Noir',
        description: 'A captivating blend of exotic spices and deep amber. This premium fragrance opens with vibrant top notes of bergamot and cardamom, followed by a heart of rich jasmine and iris. The base notes of amber, vanilla, and musk create a long-lasting scent that evolves throughout the day.',
        price: 89.99,
        image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 15,
        featured: true
      },
      '2': {
        _id: '2',
        name: 'Golden Aura',
        brand: 'Éclat',
        description: 'Luxurious notes of jasmine, vanilla, and sandalwood blend harmoniously in this elegant fragrance. Golden Aura opens with bright citrus and bergamot, transitioning to a floral heart of jasmine and rose. The base notes of vanilla, sandalwood, and amber create a warm, lingering trail that captivates the senses.',
        price: 75.50,
        oldPrice: 95.00,
        image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 8,
        featured: true
      },
      '3': {
        _id: '3',
        name: 'Velvet Rose',
        brand: 'Opulence',
        description: 'An elegant composition featuring Bulgarian rose and patchouli. Velvet Rose is a sophisticated fragrance that begins with sparkling notes of pink pepper and raspberry. The heart reveals a lush bouquet of Bulgarian rose, peony, and lily of the valley. The base notes of patchouli, vetiver, and amber provide depth and sensuality that lasts throughout the day.',
        price: 120.00,
        image: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 12,
        featured: true
      },
      '4': {
        _id: '4',
        name: 'Ocean Breeze',
        brand: 'Aqua Vitae',
        description: 'Fresh and invigorating scent with notes of sea salt and citrus. This refreshing body spray evokes the feeling of a coastal breeze, combining marine notes with zesty lemon and grapefruit. Light floral accents and a hint of musk create a clean, energizing fragrance perfect for everyday wear.',
        price: 65.00,
        image: 'https://images.pexels.com/photos/190333/pexels-photo-190333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'body-spray',
        stock: 20
      },
      '5': {
        _id: '5',
        name: 'Arctic Chill',
        brand: 'Nordic',
        description: 'A cool, refreshing deodorant with long-lasting protection. Arctic Chill combines crisp mint and eucalyptus with subtle woody undertones for a clean, invigorating scent. The advanced formula provides 48-hour protection while being gentle on skin.',
        price: 25.99,
        image: 'https://images.pexels.com/photos/5748755/pexels-photo-5748755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'deodorant',
        stock: 30
      },
      '6': {
        _id: '6',
        name: 'Amber Woods',
        brand: 'Luxe Noir',
        description: 'Warm and woody scent perfect for evening occasions. Amber Woods is a sophisticated fragrance featuring a harmonious blend of warm amber, cedarwood, and sandalwood. Hints of vanilla and musk add depth and sensuality to this captivating scent that lingers on the skin.',
        price: 95.00,
        image: 'https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        category: 'perfume',
        stock: 7
      }
    };
    
    const product = mockProducts[id];
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Order routes
app.post('/api/orders', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, totalAmount } = req.body;
    
    if (!items || !items.length || !shippingAddress || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // In a real app, you would validate items, check stock, etc.
    
    // Create order
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalAmount,
      status: 'pending',
      paymentStatus: 'paid' // Assuming payment is already processed
    });
    
    // Save order
    // await order.save();
    
    res.status(201).json({
      message: 'Order created successfully',
      orderId: '12345' // Mock order ID
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/orders', authenticate, async (req, res) => {
  try {
    // In a real app, fetch orders from DB
    // const orders = await Order.find({ user: req.user._id })
    //   .populate('items.product')
    //   .sort({ createdAt: -1 });
    
    // Mock data for development
    const mockOrders = [
      {
        _id: '1',
        user: {
          _id: req.user._id,
          email: req.user.email,
          isAdmin: req.user.isAdmin
        },
        items: [
          {
            product: {
              _id: '1',
              name: 'Midnight Mystique',
              brand: 'Luxe Noir',
              description: 'A captivating blend of exotic spices and deep amber.',
              price: 89.99,
              image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'perfume',
              stock: 15
            },
            quantity: 2,
            price: 89.99
          },
          {
            product: {
              _id: '2',
              name: 'Golden Aura',
              brand: 'Éclat',
              description: 'Luxurious notes of jasmine, vanilla, and sandalwood.',
              price: 75.50,
              image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'perfume',
              stock: 8
            },
            quantity: 1,
            price: 75.50
          }
        ],
        totalAmount: 255.48,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        status: 'delivered',
        paymentStatus: 'paid',
        createdAt: '2023-11-15T10:30:00Z'
      },
      {
        _id: '2',
        user: {
          _id: req.user._id,
          email: req.user.email,
          isAdmin: req.user.isAdmin
        },
        items: [
          {
            product: {
              _id: '3',
              name: 'Velvet Rose',
              brand: 'Opulence',
              description: 'An elegant composition featuring Bulgarian rose and patchouli.',
              price: 120.00,
              image: 'https://images.pexels.com/photos/265144/pexels-photo-265144.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
              category: 'perfume',
              stock: 12
            },
            quantity: 1,
            price: 120.00
          }
        ],
        totalAmount: 120.00,
        shippingAddress: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        status: 'shipped',
        paymentStatus: 'paid',
        createdAt: '2023-12-05T14:20:00Z'
      }
    ];
    
    res.status(200).json(mockOrders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin routes
app.get('/api/admin/orders', authenticate, isAdmin, async (req, res) => {
  try {
    // In a real app, you would fetch all orders from the database
    // For development, return mock data similar to the user orders
    res.status(200).json([]);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/admin/orders/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    // In a real app, you would update the order in the database
    
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Connect to MongoDB
  // await connectDB();
});