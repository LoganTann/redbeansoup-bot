import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    Embed,
    getUser,
    InteractionResponseTypes,
} from "../../deps.ts";
import { createCommand } from "./mod.ts";
import { getUwuUrl } from "../utils/uwu.ts";

createCommand({
    name: "pat",
    description: "Give a pat to someone",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    options: [
        {
            name: "user",
            description: "user to pat",
            type: ApplicationCommandOptionTypes.User,
            required: false,
        },
        {
            name: "comment",
            description: "a kind comment to add",
            type: ApplicationCommandOptionTypes.String,
            required: false,
        },
    ],
    execute: async (Bot, interaction) => {
        const imageType = "pat";
        const template = {
            title: "*pat pat*",
            title2: "{user} has given a pat to {target}",
        };

        let title = template.title;
        let description;

        for (const arg of interaction.data?.options || []) {
            if (arg.name === "user") {
                const target = await getUser(
                    Bot,
                    arg.value as unknown as bigint
                );

                title = template.title2
                    .replace(
                        "{user}",
                        interaction.member?.nick || interaction.user.username
                    )
                    .replace("{target}", target.username);
            } else {
                description = "> ".concat(arg.value as string);
            }
        }
        const imgURL = await getUwuUrl(imageType);
        const embed: Embed = {
            title,
            description,
            color: 14825785,
            image: { url: imgURL },
        };
        if (interaction.notASlashCommand) {
            if (interaction.channelId) {
                Bot.helpers.sendMessage(interaction.channelId, {
                    embeds: [embed],
                    messageReference: {
                        messageId: interaction.id,
                        channelId: interaction.channelId,
                        guildId: interaction.guildId,
                        failIfNotExists: false,
                    },
                });
            }
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
