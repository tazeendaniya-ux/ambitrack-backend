const db = require("../config/firebase");
const bcrypt = require("bcryptjs");

/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    };

    // Save to Firestore
    const userRef = await usersRef.add(newUser);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: userRef.id,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * LOGIN USER
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usersRef = db.collection("users");
    const snapshot = await usersRef.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    let userData;

    snapshot.forEach((doc) => {
      userData = {
        id: doc.id,
        ...doc.data(),
      };
    });

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      userData.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};