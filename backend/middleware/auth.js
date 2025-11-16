// 认证中间件
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resume = require('../models/Resume');

// 验证JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '访问令牌缺失'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error('Token验证错误:', error);
    return res.status(401).json({
      success: false,
      message: '访问令牌无效或已过期'
    });
  }
};

// 检查资源所有权
const checkOwnership = (Model) => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params.id;
      const userId = req.user.id;

      let whereClause = { id: resourceId };
      
      // 根据模型类型添加用户ID检查
      if (Model === Resume) {
        whereClause.userId = userId;
      }

      const resource = await Model.findOne({ where: whereClause });

      if (!resource) {
        return res.status(404).json({
          success: false,
          message: '资源不存在或无权访问'
        });
      }

      req.resource = resource;
      next();

    } catch (error) {
      console.error('所有权检查错误:', error);
      res.status(500).json({
        success: false,
        message: '权限验证失败'
      });
    }
  };
};

module.exports = {
  authenticateToken,
  checkOwnership
};








