const hash = require("../domain/utils/Hash");

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
      return hash(user.password)
        .then(success => {
          user.password = success;
        })
        .catch(err => {
          if (err) console.log(err);
        });
    });

  return UserDto;
};
