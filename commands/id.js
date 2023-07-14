const config = require('../config.js');
module.exports = {
  name: 'id',
  description: 'id',
  usage: '{prefix}id',
  shortHands: ['id'],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` لا يوجد تكت تابع لهذه القناة.');
    let displayName = msg.member.nick;
if (msg.member.nick === null) {
displayName = msg.member.username + "#" + msg.member.discriminator;
    }
    let att = '';
    if (msg.attachments[0] !== undefined) {
      att = msg.attachments[0].url;
    }
    
    bot  .getDMChannel(checkMail.userID)
.then(bot.createMessage(msg.channel.id, ' `' + msg.member.mention + '`'), msg.delete());

  },
};
