const hashPromise = require("../domain/utils/Hash");
const arrayUtils = require("../domain/utils/Array");

module.exports = (sequelize, DataTypes) => {
  var MessageDto = sequelize.define('Message', {
    hash: DataTypes.STRING,
    from: DataTypes.STRING,
    recipients: DataTypes.STRING,
    content: DataTypes.STRING
  });

  MessageDto.prototype.generateHash = function(){
    return hashPromise(this.getRecipients()
                .concat(this.from)
                .sort()
                .join('_'));
  };
  MessageDto.prototype.updateHash = function() {
    var that = this;
    return that.generateHash(hash => {
      that.hash = hash;
      return that;
    })
  }

  MessageDto.prototype.setRecipients = function(value) {
    if(value instanceof Array){
      this.recipients = value.join('_');
    } else {
      this.recipients = value;
    }
    return this.updateHash();
  };

  MessageDto.prototype.getRecipients = function() {

    if(!this.recipients){
      return '';
    }

    return this.recipients.split('_');
  };

  MessageDto.beforeCreate(function(message, options) {
    console.error("Before Create");
    return message.generateHash()
      .then(success => {
        console.error("set hash");
        message.hash = success;
      })
      .catch(err => {
        if (err) console.log(err);
      });
  });

  return MessageDto;
};
