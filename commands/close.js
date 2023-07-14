const mail = require('../modmail.js').get;
const config = require('../config.js');
const path = require('path');
const fs = require('fs');
module.exports = {
  name: 'cr',
  description: 'Closes a Ticket thread.',
  usage: '{prefix}cr [text]',
  shortHands: ['cr'],
  execute(bot, msg, args, checkMail) {
    if (checkMail === null) return bot.createMessage(msg.channel.id, '`!` لا يوجد تكت تابع لهذه القناة.');
    if (args[1] === undefined) {
      let displayName = msg.member.nick;
if (msg.member.nick === null) 
displayName = msg.member.username + "#" + msg.member.discriminator;
      mail.updateDB(msg.channel.id, true, false);
      bot
        .getDMChannel(checkMail.userID)
        .then((bot) => bot.createMessage(' > ** <:image1:1027196105315864667> Your Ticket Closed By ' + displayName + '**'))
        .then(() => {
          bot.createMessage(config.logChannel, {
            embed: {
              title: 'Ticket Closed',
              fields: [
                {
                  name: 'ticket',
                  value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
                  inline: true,
                },
                {
                  name: 'Details',
                  value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
                  inline: true,
                },
              ],
              color: config.color,
            },
          });
          try {
            const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
            const buffer = fs.readFileSync(file);
            bot
              .createMessage(config.logChannel, `ModMail Transcript (${msg.channel.id})`, {
                file: buffer,
                name: 'transcript.txt',
              })
              .then(msg.channel.delete());
          } catch (error) {
            bot.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
          }
        });
    } else if (args[1] === 'silent') {
      bot.createMessage(config.logChannel, {
        embed: {
          title: 'Ticket Closed',
          fields: [
            {
              name: 'ModMail',
              value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
              inline: true,
            },
            {
              name: 'Details',
              value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
              inline: true,
            },
          ],
          color: config.color,
        },
      });
      try {
        const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
        const buffer = fs.readFileSync(file);
        bot
          .createMessage(config.logChannel, `ModMail Transcript (${msg.channel.id})`, {
            file: buffer,
            name: 'transcript.txt',
          })
          .then(msg.channel.delete());
      } catch (error) {
        bot.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
      }
    } else if (args[1] === 'with') {
      const getW = msg.content.slice(config.prefix.length + args[0].length + args[1].length + 2);
      bot
        .getDMChannel(checkMail.userID)
        .then((bot) => bot.createMessage('> ** <:image1:1027196105315864667> Your Ticket Closed By [Hide Admin]**' + getW))
        .then(() => {
          bot.createMessage(config.logChannel, {
            embed: {
              title: 'Ticket Closed',
              fields: [
                {
                  name: 'Ticket',
                  value: msg.channel.name + '\n(`' + msg.channel.id + '`)',
                  inline: true,
                },
                {
                  name: 'Details',
                  value: 'Moderator: ' + msg.author.mention + '\n(' + msg.author.username + '#' + msg.author.discriminator + ')',
                  inline: true,
                },
              ],
              color: config.color,
            },
          });
          try {
            const file = path.join(__dirname, '../logs/' + msg.channel.id + '.txt');
            const buffer = fs.readFileSync(file);
            bot
              .createMessage(config.logChannel, `Ticket Transcript (${msg.channel.id})`, {
                file: buffer,
                name: 'transcript.txt',
              })
              .then(msg.channel.delete());
          } catch (error) {
            bot.createMessage(msg.channel.id, '`X` Unable to close channel due to an error.\n`' + error + '`');
          }
        });
    }
  },
};
