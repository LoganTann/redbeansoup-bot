import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
    ActivityTypes
} from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

import EmojiStorage from "../events/dirtyEmojiTracker/emojiStorage.ts";

createCommand({
    name: "emojis",
    description: "Liste les emojis par utilisations",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {

        const description = EmojiStorage.getInstance().getEmojis(interaction.guildId) || "no data";

        const embeds = [
            {
                title: "Le top des emojis du serveur",
                description
            },
        ];

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
