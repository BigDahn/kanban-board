const express = require('express');

const {
  signUp,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteUser,
  logout,
} = require('../controller/authController');
const {
  getUser,
  getMe,
  updateMe,
  updateUserProfile,
  resizeUserPhoto,
  updateEmail,
  verifyOtpAndUpdateEmail,
  resendOtp,
} = require('../controller/userController');

const router = express.Router();

router.post('/signUp', signUp);
router.post('/login', login);
router.patch('/resetPassword/:token', resetPassword);
router.post('/forgotPassword', forgotPassword);

router.use(protect);
router.get('/getMe', getMe, getUser);
router.patch('/updateMe', updateUserProfile, resizeUserPhoto, updateMe);
router.delete('/deleteMe', deleteUser);
router.patch('/updatePassword', updatePassword);
router.patch('/updateEmail', updateEmail);
router.post('/updateEmail/verify-otp', verifyOtpAndUpdateEmail);
router.post('/updateEmail/resend-otp', resendOtp);
router.post('/logout', logout);

module.exports = router;
