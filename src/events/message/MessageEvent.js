const BaseEvent = require('../../utils/structures/BaseEvent');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const Ticket = new Map();

module.exports = class MessageEvent extends BaseEvent {
  constructor() {
    super('messageCreate');
  }
  
  async run(client, message) {
    if (message.author.bot) return;

    // Check if message is from a channel
    if (message.channel) {
      const categoryID = "904886933069639680"; 

      const guild = client.guilds.cache.get("904886448862412821");


      // Check if message is from support channels
      if (message.channel.parentId === categoryID) {
        let member = message.guild.members.cache.get(message.channel.topic); // Get the member by its ID, the ID is located in the support channel name.

        //console.log(member);
        // If member is not found, send the message.
        if (!member) return message.channel.send("An error has been occurred, unable to send message, please try again!"); 

        if (message.content.startsWith(client.prefix)) {
          const [cmdName, ...cmdArgs] = message.content.slice(client.prefix.length).trim().split(/\s+/);
          if (cmdName === "r") {
            let content = cmdArgs.slice(0).join(' ');

            if (!content) return;

            const System = new MessageEmbed()
            .setColor("DARK_BLUE")
            .setAuthor(`Response by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true}))
            .setDescription(`**Response:** ${content}`);

            return member.send({ embeds: [System]});
          } else if (cmdName === "close") {
            const channel = message.channel;

            const System = new MessageEmbed() 
            .setColor("BLUE")
            .setAuthor(`Ticket Closed`, client.user.displayAvatarURL({dynamic: true}))
            .setDescription(`The ticket has been successfully closed by ${message.author}! Deleting this channel...`)
            .setFooter("Grace Community", client.user.displayAvatarURL({dynamic: true}));

            const System1 = new MessageEmbed()
            .setColor("RED")
            .setAuthor(`Ticket Closed`, client.user.displayAvatarURL({dynamic: true}))
            .setDescription(`The ticket has been closed by **${message.author.tag}**! To open new support ticket, please send another message!`)
            .setFooter("Grace Community", client.user.displayAvatarURL({dynamic: true}));

            channel.send({ embeds: [System]})
            member.send({embeds: [System1]});

            setTimeout(() => {
              return channel.delete();
            }, 2000)
          }
        }
      }
    }
    if (!message.guild) {
      const guild = client.guilds.cache.get("904886448862412821");
      if (!guild) return;
      const categoryID = "904886933069639680"; 
      const supportChannel = guild.channels.cache.find((n) => n.topic === `${message.author.id}`);

      if (!supportChannel) {
        const channel = await guild.channels.create(message.author.tag, {
          type: "GUILD_TEXT",
          parent: categoryID,
          topic: message.author.id
        });
        const System = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor("Ticket Started", "https://cdn.discordapp.com/attachments/905597687401938944/905648649231536149/unknown.png")
        .setDescription("Your message has been recorded. Please be patient, one of our staff members will get back to you soon!")

        const System2 = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${message.author.tag}'s ticket`, message.author.displayAvatarURL({ dynamic: true}))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField("Username: ", message.author.username, true)
        .addField("ID: ", message.author.id, true)
        .addField("Discriminator: ", message.author.discriminator, true)
        .addField("Avatar: ", `[Click here to view avatar](${message.author.displayAvatarURL({ dynamic: true })})`, true)
        .addField("Created At: ", `${moment(message.author.createdAt).format("DD-MM-YYYY [at] HH:mm")}`, true)
        .addField("Joined Server At: ", `${moment(message.author.joinedAt).format("DD-MM-YYYY [at] HH:mm")}`, true)
        .setTimestamp()

        channel.send({ embeds: [System2] });
        channel.send(`**${message.author.tag}** [${message.author.id}] - ${message.content}`)
        return message.author.send({ embeds: [System]});


      } else {
              const System3 = new MessageEmbed()
        .setColor("BLUE")
        .setAuthor(`${message.author.tag}'s ticket`, message.author.displayAvatarURL({ dynamic: true}))
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**${message.author.tag}** - ${message.content}`)
        return supportChannel.send(`System3`);
      }
      
    }
    if (message.content.startsWith(client.prefix)) {
      const [cmdName, ...cmdArgs] = message.content
      .slice(client.prefix.length)
      .trim()
      .split(/\s+/);
      const command = client.commands.get(cmdName);
      if (command) {
        command.run(client, message, cmdArgs);
      }
    }
  }
}
