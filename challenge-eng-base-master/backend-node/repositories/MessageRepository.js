var models  = require('../models');
var User = require('../domain/entities/User');
var Message = require('../domain/entities/Message');

class MessageRepository {
  add(from, recipients, content) {
    return models.Message.build({
      from: from.email,
      recipients: recipients.map(x => x.email),
      content: content
    }).save().then(message => {
      return new Message(message.from,
                        message.recipients.split('_'),
                        message.content,
                        message.createdAt);
    });
  }

  fetch(from, recipients, page, limit) {
    return models.Message.findAll({
      where: {
        from: from
      }
    });

    /*return models.Message.build({
      from: from.email,
      recipients: recipients.map(x => x.email),
    })
    .generateHash()
    .then(hash => {
      return models.Message.findAndCountAll({
        where: {
          hash: hash
        },
        offset: page * limit,
        limit: limit
      }).then(result => {
        console.error(result.count);
        console.error(result.rows);
      }).catch(errors => {
        throw new Error(errors.errors[0].message);
      });
    });*/
  }
}

module.exports = new MessageRepository();
