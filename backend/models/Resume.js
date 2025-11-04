// SQLite简历模型
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [1, 100]
    }
  },
  personalInfo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  jobIntention: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  education: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  workExperience: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  projects: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  selfEvaluation: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  evaluation: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'resumes',
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['status']
    }
  ]
});

// 关联关系
Resume.associate = function(models) {
  Resume.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = Resume;





