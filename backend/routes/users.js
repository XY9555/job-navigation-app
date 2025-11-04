// SQLite版本的用户路由
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// 获取用户信息
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user.toJSON()
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

// 更新用户信息
router.put('/profile', [
  authenticateToken,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('姓名长度为1-50个字符'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('age')
    .optional()
    .isInt({ min: 16, max: 100 })
    .withMessage('年龄必须在16-100之间')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { name, email, gender, age, settings } = req.body;
    
    await req.user.update({
      ...(name && { name }),
      ...(email && { email }),
      ...(gender && { gender }),
      ...(age && { age }),
      ...(settings && { settings })
    });

    res.json({
      success: true,
      message: '用户信息更新成功',
      data: req.user.toJSON()
    });

  } catch (error) {
    console.error('更新用户信息错误:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败'
    });
  }
});

// 更新头像
router.put('/avatar', [
  authenticateToken,
  body('avatar')
    .notEmpty()
    .withMessage('头像数据不能为空')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { avatar } = req.body;
    
    await req.user.update({ avatar });

    res.json({
      success: true,
      message: '头像更新成功',
      data: { avatar }
    });

  } catch (error) {
    console.error('更新头像错误:', error);
    res.status(500).json({
      success: false,
      message: '更新头像失败'
    });
  }
});

// 修改密码
router.put('/password', [
  authenticateToken,
  body('currentPassword')
    .notEmpty()
    .withMessage('请输入当前密码'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('新密码至少6位')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: '输入验证失败',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // 验证当前密码
    const isValidPassword = await req.user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误'
      });
    }

    // 更新密码
    await req.user.update({ password: newPassword });

    res.json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码错误:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败'
    });
  }
});

module.exports = router;





