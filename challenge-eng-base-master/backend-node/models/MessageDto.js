const hashPromise = require("../domain/utils/Hash");

module.exports = (sequelize, DataTypes) => {
  var MessageDto = sequelize.define('Message', {
    hash: DataTypes.STRING,
    from: DataTypes.STRING,
    recipients: DataTypes.STRING,
    content: DataTypes.STRING,
    createdAt: DataTypes.DATE
  });

  MessageDto.prototype.generateHash = function(){
    return hashPromise(this.recipients
                .concat(this.from)
                .sort()
                .join('_'));
  };

  MessageDto.beforeCreate(function(message, options) {
      return message.generateHash()
        .then(success => {
          message.hash = success;
          message.recipients = message.recipients.join('_');
        })
        .catch(err => {
          if (err) console.log(err);
        });
    });

  return MessageDto;
};
