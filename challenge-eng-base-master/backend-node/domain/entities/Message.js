
class Message {
  constructor(from, recipients, content, sentTime){
    this.from = from;
    this.recipients = recipients;
    this.content = content;
    this.sentTime = sentTime;
  }
}

module.exports = Message;
