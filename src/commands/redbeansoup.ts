import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
  name: "redbeansoup",
  description: "En savoir plus sur l'emote redbeansoup.",
  type: ApplicationCommandTypes.ChatInput,
  execute: async (Bot, interaction) => {
    const ping = Date.now() - snowflakeToTimestamp(interaction.id);
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `L'emote redbeansoup proviens du serveur français Kagerou Project. \nMassivement utilisée, elle a été propagée dans plus d'une 10aine de serveurs <:redbeansoup:464529611292934156>. \nTéléchargez-la sur https://cdn.discordapp.com/emojis/464529611292934156.webp`,
        },
      },
    );
  },
});
