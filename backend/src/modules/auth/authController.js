// src/modules/auth/authController.js
const authService = require('./authService');

// ✅ exports 객체에 직접 할당합니다.
exports.signup = async (req, res) => {
  try {
    const user = await authService.registerOrUpdateUser(req.body);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};