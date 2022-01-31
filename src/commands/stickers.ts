import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
} from "../../deps.ts";
import { createCommand } from "./mod.ts";
import { embedField } from "../types/embeds.ts";
import stickerList from "../stickerlist.ts";

createCommand({
    name: "stickers",
    description: "liste les stickers disponibles",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {
        const fields: embedField[] = Object.entries(stickerList).map(
            ([key, value]) => ({
                name: `${key}`,
                value: `[lien](${value})`,
                inline: true,
            })
        );

        const embeds = [
            {
                title: "Les stickers Kagerou Project",
                description:
                    "Voici la liste de toutes les réactions (et le lien des images qui y sont associées)\nEntrez le nom d'un sticker, et le bot se chargera de remplacer le message par le sticker correspondant.",
                color: 14825785,
                fields,
            },
        ];

        if (interaction.notASlashCommand) {
            Bot.helpers.sendMessage(interaction.channelId, {
                content:
                    "*:eyeglasses: utilisez les commandes slash si elles sont disponibles !*",
                embeds,
            });
            return;
        }
        await Bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    embeds,
                },
            }
        );
    },
});
