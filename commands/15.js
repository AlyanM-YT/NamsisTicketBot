const config = require('../config.js');
module.exports = {
  name: '15',
  description: '15',
  usage: '{prefix}15 to close ticket',
    shortHands: ['15'],
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
      .then((bot) => bot.createMessage('> **سيتم اغلاق تذكرتك خلال 15 دقيقه في حال عدم الرد**'))
      .then(bot.createMessage(msg.channel.id, `> **تم ارسال : سيتم اغلاق تذكرتك خلال 15 دقيقه في حال عدم الرد**`), msg.delete());
  },
};
