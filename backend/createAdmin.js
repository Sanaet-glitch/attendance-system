const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import your User model
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  createAdminUser();
}).catch(err => {
  console.error('DB connection error:', err);
});

async function createAdminUser() {
  try {
    // Set up your admin credentials
    const username = 'adminUser';
    const password = 'AdminPassword123'; // Choose a strong password

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new admin user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'admin'
    });

    await newUser.save();
    console.log('Admin user created successfully:', newUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}
