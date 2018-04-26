var models  = require('../models');
var User = require('../domain/entities/User');
var Message = require('../domain/entities/Message');

class MessageRepository {
  add(from, recipients, content) {
    return models.Message.build({
      from: from,
      content: content
    })
    .setRecipients(recipients)
    .then(msg => {
      return msg.save()
      .then(message => {
        return new Message(message.from,
                        message.recipients,
                        message.content,
                        message.createdAt);
      })
      .catch(errors => {
        throw new Error(errors.errors[0].message);
      });
    });
  }

  fetch(from, recipients, page, limit) {
    return models.Message.build({
      from: from
    })
    .setRecipients(recipients)
    .then(msg => {
      return models.Message.findAndCountAll({
        where: {
          hash: msg.hash
        },
        offset: page * limit,
        limit: limit
      }).then(result => {
        return {
          messages: result.rows.map(x => new Message(
            x.from,
            x.getRecipients(),
            x.content,
            x.sentTime
          )),
          total: result.count
        };
      }).catch(errors => {
        throw new Error(errors.errors[0].message);
      });
    });

  }
}

module.exports = new MessageRepository();
