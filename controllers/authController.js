const db = require("../config/firebase");

/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    if (!name || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const usersRef = db.collection("users");

    const snapshot = await usersRef
      .where("phone", "==", phone)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    const newUser = {
      name,
      phone,
      role,
      createdAt: new Date(),
    };

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
    const { phone } = req.body;

    const usersRef = db.collection("users");

    const snapshot = await usersRef
      .where("phone", "==", phone)
      .get();

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

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
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
};const db = require("../config/firebase");

/**
 * REGISTER USER
 */
const registerUser = async (req, res) => {
  try {
    const { name, phone, role } = req.body;

    // Validation
    if (!name || !phone || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const usersRef = db.collection("users");

    const snapshot = await usersRef
      .where("phone", "==", phone)
      .get();

    if (!snapshot.empty) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered",
      });
    }

    // Create user object
    const newUser = {
      name,
      phone,
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
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const usersRef = db.collection("users");

    const snapshot = await usersRef
      .where("phone", "==", phone)
      .get();

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

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
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