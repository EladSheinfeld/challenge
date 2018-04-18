const bcrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  var UserDto = sequelize.define('User', {
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      validate: {
        isEmail: true
      }
    },
    password: DataTypes.STRING
  });

  UserDto.beforeCreate(function(user, options) {
      return cryptPassword(user.password)
        .then(success => {
          user.password = success;
        })
        .catch(err => {
          if (err) console.log(err);
        });
    });
  function cryptPassword(password) {
    return new Promise(function(resolve, reject) {
      bcrypt.genSalt(10, function(err, salt) {
        // Hash password using bycrpt module
        if (err) return reject(err);

        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) return reject(err);
          return resolve(hash);
        });
      });
    });
  }

  return UserDto;
};
