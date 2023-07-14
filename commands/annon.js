const config = require('../config.js');
module.exports = {
  name: 'a',
  description: 'Replies to a user in a ModMail thread without your username showing..',
  usage: '{prefix}a [text]',
  shortHands: ['a'],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` لا يوجد تكت تابع لهذه القناة.');
 let fullU = msg.member.nick;
if (msg.member.nick === null) {
fullU = msg.member.username + "#" + msg.member.discriminator;
    }
    if (args[1] === undefined) return;
    const content = msg.content.slice(config.prefix.length + args[0].length + 1);
    bot
      .getDMChannel(checkMail.userID)
      .then((bot) => bot.createMessage('**' + config.msgPrefix + ' [Hide Admin]** : ' + content))
      .then(bot.createMessage(msg.channel.id, ' **' + config.msgPrefix + ' [Hide Admin]  '+ fullU +' ** : ' + content), msg.delete());
  },
};
