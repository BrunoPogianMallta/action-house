const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { v4: uuidv4 } = require('uuid'); 

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING, 
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  balance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  accountType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'basic', 
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true, // Pode ser nulo até que um reset de senha seja solicitado
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true, // Pode ser nulo até que um reset de senha seja solicitado
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (user) => {
      const prefix = User.tableName.toUpperCase() + '_';
      user.id = `${prefix}${uuidv4()}`; 
      
    }
  }
});

module.exports = User;
