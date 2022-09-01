import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
    ActivityTypes
} from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
    name: "init",
    description: "cette commande ne fais rien. Askip.",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {
        const embeds = [
            {
                title: "cette commande ne fais rien. Askip.",
                description: "<:redbeansoup:464529611292934156>"
            },
        ];

        await Bot.helpers.editBotStatus({
            status: "online",
            activities: [{ name: "soup.kagescan.fr", type: ActivityTypes.Game, createdAt: Date.now() }],
        });

        if (interaction.notASlashCommand) {
            Bot.helpers.sendMessage(interaction.channelId, { embeds });
            return;
        }
        await Bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data:  {
                    embeds
                }
            }
        );
    },
});
