
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required."
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await User.findOne({
      email: normalizedEmail
    });

    if (existing) {
      return res.status(409).json({
        message: "This email is already registered."
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password_hash: hash,
      phone: phone || "",
      role: "customer"
    });

    res.status(201).json({
      message: "Registration successful!",
      userId: newUser._id
    });

  } catch (error) {
    console.error("Register error:", error.message);

    res.status(500).json({
      message: "Could not create account."
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Email, password and role are required."
      });
    }

    const allowedRoles = ["customer", "admin", "mechanic"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role selected."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail
    });

    if (!user) {
      return res.status(401).json({
        message: "Account not found. Please register first."
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    // Demo role selection
    const demoUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: role
    };

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful!",
      token,
      user: demoUser
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed."
    });
  }
};
