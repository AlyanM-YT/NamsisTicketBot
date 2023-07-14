const config = require('../config.js');
module.exports = {
  name: 'ea',
  description: 'ea',
  usage: '{prefix}ea',
  shortHands: ['ea'],
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
      .then((bot) => bot.createMessage('**<:NamsisPurple:1027196105315864667> ' + 'تم قبول تذكرتك من قبل [Hide Admin] **'))
      
.then(bot.createMessage(msg.channel.id, '**تم قبول التذكرة بشكل مخفي من قبل ' + displayName + ' **' ), msg.delete());

  },
};
