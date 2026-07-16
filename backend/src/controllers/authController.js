import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readDB, writeDB } from '../utils/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'jodhpur_royal_secret_key_13579';

// In-memory store for active OTP codes
const otpStore = new Map();

// Helper to seed admin account if not present
const checkAndSeedAdmin = (db) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminExists = db.users.find(u => u.email === adminEmail);
  
  if (!adminExists) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'DevPassword123!';
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);
    const newAdmin = {
      id: 'admin-1',
      name: 'Royal Admin',
      email: adminEmail,
      phone: '+919999999999',
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    db.users.push(newAdmin);
    writeDB(db);
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const db = readDB();
    checkAndSeedAdmin(db);

    const userExists = db.users.find(u => u.email === email || u.phone === phone);
    if (userExists) {
      return res.status(400).json({ message: 'User with this email or phone already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const db = readDB();
    checkAndSeedAdmin(db);

    const user = db.users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

export const requestOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(phone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes validity
    });

    console.log(`\n=========================================\n[SMS SIMULATOR] OTP for ${phone}: ${otp}\n=========================================\n`);

    res.status(200).json({ message: 'OTP sent successfully (Simulated)', phone });
  } catch (error) {
    res.status(500).json({ message: 'Server error requesting OTP', error: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP are required' });
    }

    const storedData = otpStore.get(phone);
    if (!storedData) {
      return res.status(400).json({ message: 'OTP not requested or expired' });
    }

    if (storedData.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }

    // OTP verified, clear it
    otpStore.delete(phone);

    const db = readDB();
    checkAndSeedAdmin(db);

    let user = db.users.find(u => u.phone === phone);
    
    // Auto-register guest OTP users as customer
    if (!user) {
      user = {
        id: 'user-' + Date.now(),
        name: `Guest (${phone.slice(-4)})`,
        email: `${phone.replace('+', '')}@temp-jodhpur.com`,
        phone,
        password: bcrypt.hashSync('TempPassword123', 10),
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
      writeDB(db);
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error verifying OTP', error: error.message });
  }
};
