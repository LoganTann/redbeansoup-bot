import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "redbeansoup",
  description: "Aide + infos sur le bot",
  type: ApplicationCommandTypes.ChatInput,
  devOnly: false,
  execute: async (Bot, interaction) => {
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    const embeds = [
      {
        "title": "What's this?",
        "description": "L'emote redbeansoup proviens d'un [chapitre](https://kagescan.fr/anthology/scan/10/) d'anthology [hors-canon](https://kagerouproject.fandom.com/fr/wiki/Blog_utilisateur:ShinProg/Hors_Canon_-_Kagerou_Project#Hors_canon) de la série Kagerou Project.  Utilisée au départ dans le serveur du fandom français, elle a été propagée dans plus d'une 10aine d'autres <:redbeansoup:464529611292934156>.\n\nParticipez à son partage en la téléchargeant sur https://cdn.discordapp.com/emojis/464529611292934156.webp !",
        "color": 14825785,
        "footer": {
          "text": `J'ai mis ${ping}ms pour répondre !`
        },
        "thumbnail": {
          "url": "https://cdn.discordapp.com/emojis/464529611292934156.webp"
        }
      }
    ]
    
    if(interaction.notASlashCommand) {
      Bot.helpers.sendMessage(interaction.channelId, { content: "*:eyeglasses: utilisez les commandes slash si elles sont disponibles !*", embeds });
      return;
    }
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds
        }
      },
    );
  }
});