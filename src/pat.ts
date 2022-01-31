import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
} from "../../deps.ts";
import { createCommand } from "./mod.ts";
import { embedField } from "../types/embeds.ts";
import stickerList from "../stickerlist.ts";
import { getUwuUrl } from "./utils/uwu";

createCommand({
    name: "pat",
    description: "pat someone",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {
        const imageType="pat";

        const imgURL = await getUwuUrl(imageType);
        const embed : Embed = 
            {
                title: `pats someone`,
                color: 14825785,
                image: { url: imgURL },
            }
        ;
        

        if (interaction.notASlashCommand) {
            Bot.helpers.sendMessage(interaction.channelId, { embeds: [embed], });
            return;
        }
        await Bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds: [embed],
                },
            }
        );
    },
});
