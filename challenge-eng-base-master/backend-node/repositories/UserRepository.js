var models  = require('../models');
var User = require('../domain/entities/User');

class UserRepository {

  add(email, password){
    return models.User.build({
      email: email,
      password: password
    }).save().then(user => {
      return new User(user.email);
    }).catch(errors => {
      throw new Error(errors.errors[0].message);
    });
  }

  exists(email) {
    return models.User.findOne({
      where: {
        email: email
      }
    }).then(user => {
      return user !== null;
    });
  }
}

module.exports = new UserRepository();
