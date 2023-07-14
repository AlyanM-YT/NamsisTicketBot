const config = require('../config.js');
module.exports = {
  name: 'ar',
  description: 'ar',
  usage: '{prefix}ar',
  shortHands: [''],
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
      .then((bot) => bot.createMessage('**' + 'تم قبول تذكرتك من قبل ' + ':'  + displayName + ' <:NamsisPurple:1027196105315864667>**'))
.then(bot.createMessage(msg.channel.id, '**' + 'تم قبول التذكرة من قبل ' + '' + displayName + '**'), msg.delete());



  },
};
