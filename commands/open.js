const mail = require('../modmail.js').get;
const config = require('../config.js');
const moment = require('moment');

function updateDB(id, channel, closed, log) {
  const getMail = require('../database/template.js');
  getMail.findById(id).then((data) => {
    (data.channelID = channel), (data.isClosed = closed), (data.logFile = log);
    data.save();
  });
}

module.exports = {
  name: 'open',
  description: 'Opens a ModMail for a user.',
  usage: '{prefix}open user',
  shortHands: ['r'],
  execute(bot, msg, args, checkMail) {
    if (args[1] === undefined) return;
    const user = args[1].replace(/[\\<>@#&!]/g, '');
    mail.getModMail(user).then((mm) => {
      let userObject;
      bot.getRESTGuildMember(config.Guild, user).then(async (userOb) => {
        if (userOb === undefined) return bot.createMessage(msg.channel.id, "`!` هذا المستخدم ليس في هذا الخادم!");
        userObject = userOb;

        if (mm !== null) {
          if (mm.isClosed === false) return bot.createMessage(msg.channel.id, '`!` هذا المستخدم لديه بالفعل تكت مفتوح!');
          bot.createChannel(config.mainGuild, userObject.username + ' ' + userObject.discriminator, 0).then(async (newMail) => {
            await updateDB(userObject.id, newMail.id, false, '');
            await newMail.edit({ parentID: config.mailChannel });
            await newMail.editPermission(config.Guild, '0', '1024', 'role', '@everyone view denied.');
            await config.modRoles.forEach((r) => {
              newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
            });
            await newMail.editPermission(bot.user.id, '52224', '0', 'member', 'ModMail app allowed.');
            await bot.createMessage(newMail.id,'لقد فتح ' + msg.author.username + ' تذكرة جديدة من خلال أمر  `!open`');
            await bot.getDMChannel(userObject.id).then((bot) => bot.createMessage('`!` فتح إحدى الإدارة تذكرة معك'));
          });
        } else if (mm === null) {
          bot.createChannel(config.mainGuild, userObject.username + ' ' + userObject.discriminator, 0).then(async (newMail) => {
            await mail.createDB(userObject.id, newMail.id, false, false);
            await newMail.edit({ parentID: config.mailChannel });
            await newMail.editPermission(config.Guild, '0', '1024', 'role', '@everyone view denied.');
            await config.modRoles.forEach((r) => {
              newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
            });
            await newMail.editPermission(bot.user.id, '52224', '0', 'member', 'ModMail app allowed.');
            await bot.createMessage(newMail.id, 'لقد فتح ' + msg.author.username + ' تذكرة جديدة من خلال أمر  `!open`');
            await bot.getDMChannel(userObject.id).then((bot) => bot.createMessage('`!` تم فتح تذكرة معك'));
          });
        }
      });
    });
  },
};
