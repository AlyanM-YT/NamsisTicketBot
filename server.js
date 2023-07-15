const Eris = require('eris');
const moment = require('moment');
const config = require('./config.js');
const { SlashCommandBuilder} = require("discord.js")
const ErisComponents = require('eris-components');
const bot = new Eris("OTc1NzMxNDA3Mzc0NjQ3MzE3.Gn00Xx.z_z3Hdzcbst80o0-TSDcVRzVqXxkfVoAuHHU8U", { defaultImageFormat: 'png', getAllUsers: false, restMode: true });
require('./commandHandler.js')(bot);
const db = require(`pro.db`)
require('./database/databaseHandler.js');
require('./channelLogging.js')(bot);

const mail = require('./modmail.js').get;

function updateDB(id, channel, closed, log) {
  const getMail = require('./database/template.js');
  getMail.findById(id).then((data) => {
    (data.channelID = channel), (data.isClosed = closed), (data.logFile = log);
    data.save();
  });
}


intents: ["gulids", "gulidMessages",]
bot.on("interaction", async interaction => {
  await interaction.deferUpdate();

  if (!(interaction instanceof Eris.ComponentInteraction)) return;

  if (interaction.data.component_type === 3 && interaction.data.custom_id === "s1") {
    if (interaction.data.values[0] === "work") {
      return interaction.createMessage("ok ms")
    }
    else if (interaction.data.values[0] === "no") {
      return interaction.createMessage("b3rf")
    }
  };
});


bot.on("messageCreate", async message => {
if (message.author.bot || (!(message.channel instanceof Eris.GuildChannel))) return;
 
if (message.content.startsWith("!open")) {
  return message.channel.createMessage({
    content: "work",
    components: [{
      type: 1,
      components: [{
        type: 3,
        custom_id: "s1",
        options: [
          {
          label: "work",
          value: "yes"
        },
        {
          label: "No",
          value: "no"
        }
      ],
      placeholder: "c",
      main_values: 1
      }]
    }]
  });
};
});





bot.on("interactionCreate", async interaction => {
  if (!(interaction instanceof Eris.ComponentInteraction)) return;
  if (interaction.data.component_type === 2 &&
   interaction.data.custom_id === "idk1") {
     return interaction.createMessage("f");
   };
 });

bot.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith("!v")) {
    return message.channel.createMessage({
      content: "test",
      components: [
        {
          type: 1,
          components: [
          {
            type: 2,
             label: "heree",
              style: 1,
              
               custom_id: "idk1"
               
          }
          ]
        }
      ]
    });
  };
});






bot.on('ready', () => {
  // This below ensure the bot runs smoothly.
  if (!bot.guilds.get(config.mainGuild)) {
    console.error('Main guild must be a valid guild.'), process.exit();
  }
  if (!bot.guilds.get(config.mainGuild).channels.get(config.logChannel)) {
    console.error('Log channel must be in main guild.\nProcess exited with code 1'), process.exit();
  }
  if (!bot.guilds.get(config.mainGuild).channels.get(config.mailChannel)) {
    console.error('Mail channel must be in main guild.\nProcess exited with code 1'), process.exit();
  }
  if (bot.guilds.get(config.mainGuild).channels.get(config.mailChannel).type !== 4) {
    console.error('Mail channel must be a category.\nProcess exited with code 1'), process.exit();
  }
  config.modRoles.forEach((r) => {
    if (!bot.guilds.get(config.mainGuild).roles.get(r)) {
      console.error('Mod role must be in main guild. [' + r + ']\nProcess exited with code 1'), process.exit();
    }
  });
  if (config.msgPrefix.replace(/ /g, '') === '') {
    console.error('Add a staff message prefix!\nProcess exited with code 1'), process.exit();
  }
  if (config.prefix.replace(/ /g, '') === '') {
    console.error('Add a command prefix!\nProcess exited with code 1'), process.exit();
  }

  console.log('Bot updated successfully (' + moment(bot.startTime).format('lll') + ')');
  bot.editStatus('online', { name: config.status, type: 3 });
});

bot.on('guildCreate', (guild) => {
  if (guild.id !== config.mainGuild) {
    bot.guilds.get(guild.id).leave();
  }
});

bot.on('channelDelete', (channel) => {
  const getMail = require('./database/template.js');
  getMail.findOne({ channelID: channel.id }).then((data) => {
    if (data === null) return;
    data.isClosed = true;
    data.save();
  });
});

bot.on('error', (err) => {
  console.log(err.stack);
  if (err.toString().startsWith('Error: Connection reset by peer') || err.toString().startsWith('Error: 1001:')) return;
});

bot.on('messageCreate', (msg) => {
  if (msg.author.bot) return;
  //if (!bot.guilds.get(config.mainGuild).members.get(msg.author.id)) return
  if (msg.guildID === undefined) {
    mail.getModMail(msg.author.id).then((checkMail) => {
      // Messaging
      
      
  const fullU = msg.author.username + '#' + msg.author.discriminator;
  var currentdate = new Date(); 
  var datetime = "<:62967053951be47c43_Twemoji_1f563:1119259253862039634> Ticket Creation time : " + currentdate.getDate() + "/"
      + (currentdate.getMonth()+1)  + "/" 
      + currentdate.getFullYear() + " - "  
      + currentdate.getHours() + ":"  
      + currentdate.getMinutes() + ":" 
      + currentdate.getSeconds();  
      const botName = bot.user.username; // was being weird so, const

      let att = '';
      if (msg.attachments[0] !== undefined) {
        att = msg.attachments[0].filename + '\n' + msg.attachments[0].url;
      } else if (msg.attachments[0] === undefined) {
        att = '';
      }

      db.add(`number`,1)
      const id = db.get(`number`) 

      
      if (checkMail === null) {
        bot.createChannel(config.mainGuild, msg.author.username + ' ' + msg.author.discriminator, 0).then(async (newMail) => {
          await mail.createDB(msg.author.id, newMail.id, false, false);
          await newMail.edit({ parentID: config.mailChannel });
          await newMail.editPermission(config.mainGuild, '0', '1024', 'role', '@everyone view denied.');
          await config.modRoles.forEach((r) => {
            newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
          });
          await newMail.editPermission(bot.user.id, '52224', '0', 'member', 'Ticket app allowed.');
          bot.getRESTGuildMember(config.Guild, msg.author.id).then(async (userOb) => {
            await bot.createMessage(newMail.id, '**<:image1:1119248778893996104> [ New Ticket ]  <:image1:1119248778893996104>\n\n<:people:1119259309646295070> Ticket Creator is :  ' + fullU + '\n\n<:id:1119258316196040754> User Id is : ' + msg.author.id + '\n\n' + datetime + ' \n\n<:wh:1119260691992412251> Reason For Creation : ' + msg.cleanContent + ' \n\n[ <:NamsisPurple:1027196105315864667> Ticket created by Namsis Bot <:NamsisPurple:1027196105315864667> ]\n\nــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ**');
            await bot.createMessage(newMail.id, '\n\n**<:NamsisPurple:1027196105315864667> || [ <1@&986217872638480384> ] || <:NamsisPurple:1027196105315864667>\n\n<:emoji_18:1030703262267101204> توجد تذكرة جديدة ، يرجى قبولها في أسرع وقت ممكن <:emoji_18:1030703262267101204>\n\n<:emoji_18:1030703262267101204> `!ar` لقبول التذكرة ، اكتب الأمر**');
                      await bot.getDMChannel(msg.author.id).then((bot) => bot.createMessage('`✔` **اهلاً، تم إرسال رسالتك إلى فريق الإدارة. سنتواصل معك بأقرب وقتٍ ممكن، يرجى شرح المشكلة التي تواجهها وفي حال أنها كانت " شكوى " ، يُستحسن تقديم دلائل. كتابتك لموضوعك بالكامل بالأدلة اللازمة  يساعد في توفير وقتك ووقت الإدارة**\n\n<:id:1119258316196040754> رقم التذكرة الخاصة بك هو: ' + id +' '));

          });
        });
      } else if (checkMail !== null) {
        if (checkMail.isBanned === true) return bot.getDMChannel(checkMail.userID).then((bot) => bot.createMessage('**لا يمكنك إنشاء تذكرة جديدة. لقد تم منعك من إنشاء تذاكر في  ' + botName + '!**'));
        if (msg.content === '!ticket') { 

        if (checkMail.isClosed === true) 
          bot.createChannel(config.mainGuild, msg.author.username +"-ticket・🆔"+ id +'').then(async (newMail) => {
            await updateDB(msg.author.id, newMail.id, false, '');
            await newMail.edit({ parentID: config.mailChannel });
            await newMail.editPermission(config.mainGuild, '0', '1024', 'role', '@everyone view denied.');
            await config.modRoles.forEach((r) => {
              newMail.editPermission(r, '52224', '8192', 'role', 'ModRole view allowed.');
            });
            await newMail.editPermission(bot.user.id, '52224', '0', 'member', 'Ticket app allowed.');
            bot.getRESTGuildMember(config.Guild, msg.author.id).then(async (userOb) => {
              await bot.createMessage(newMail.id, '**<:image1:1119248778893996104> [ New Ticket ]  <:image1:1119248778893996104>\n\n<:people:1119259309646295070> Ticket Creator is :  ' + fullU + '\n\n<:idver:1129799079917006989> User Id is : ' + msg.author.id + '\n\n<:id:1119258316196040754> Ticket Id is : ' + id + '\n\n' + datetime + ' \n\n<:wh:1119260691992412251> Reason For Creation : ' + msg.cleanContent + ' \n\n[ <:NamsisPurple:1027196105315864667> Ticket created by Namsis Bot <:NamsisPurple:1027196105315864667> ]\n\nــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ**');
              await bot.createMessage(newMail.id, '\n\n**<:NamsisPurple:1027196105315864667> || [ <@1&986217872638480384> ] || <:NamsisPurple:1027196105315864667>\n\n<:emoji_18:1030703262267101204> توجد تذكرة جديدة ، يرجى قبولها في أسرع وقت ممكن <:emoji_18:1030703262267101204>\n\n<:emoji_18:1030703262267101204> `!ar` لقبول التذكرة ، اكتب الأمر**');
              await bot.getDMChannel(msg.author.id).then((bot) => bot.createMessage('`✔` **اهلاً، تم إرسال رسالتك إلى فريق الإدارة. سنتواصل معك بأقرب وقتٍ ممكن، يرجى شرح المشكلة التي تواجهها وفي حال أنها كانت " شكوى " ، يُستحسن تقديم دلائل. كتابتك لموضوعك بالكامل بالأدلة اللازمة  يساعد في توفير وقتك ووقت الإدارة\n\n> <:id:1119258316196040754> | رقم التذكرة الخاصة بك هو : '+ id +'**'));

            });
          });
        } else if (checkMail.isClosed === false) {
          bot.createMessage(checkMail.channelID, '**<:ticketlogo:1027192070911315968> [' + fullU + ']** : ' + msg.cleanContent + '\n' + att);
        }
      }
    });
  }
});

bot.connect();

const express = require('express')
const app = express();
const port = 5000

app.get('/', (req, res) => res.send('The Ice!'))

app.listen(port, () =>
console.log(`Your app is listening a http://localhost:${port}`)
); 
