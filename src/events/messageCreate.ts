import { Bot } from "../../bot.ts";
import log from "../utils/logger.ts";

Bot.events.messageCreate = (bot, interaction) => {
  if (interaction.isBot) {
    return;
  }
  //

  const result = interaction.content.match(/^\s*\$(\w+)(.+)?/) || [];
  if (result.length < 3) {
    return;
  }
  if (typeof result[2] === "undefined") {
    result[2] = "";
  }

  const command = bot.commands.get(result[1]);
  if (command) {
    interaction.data = {
      options: result[2].trim().split(" ")
        .map((a) => {return { value: a }})
    };
    interaction.notASlashCommand = true;
    command.execute(bot, interaction);
  } else {
    Bot.helpers.sendMessage(interaction.channelId, { content: `Commande inconnue: ${result[1]}` });
  }
};