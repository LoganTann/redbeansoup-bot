import {
    ApplicationCommandOptionTypes,
    ApplicationCommandTypes,
    Embed,
    getUser,
    InteractionResponseTypes,
} from "../../deps.ts";

import { getUwuUrl } from "../utils/uwu.ts";

export interface wholesomeTemplate {
    name: string;
    description: string;
    userArgDescr: string;
    title: string;
    title2: string;
}
export function generateWholesome(template: wholesomeTemplate) {
    return {
        name: template.name,
        description: template.description,
        type: ApplicationCommandTypes.ChatInput,
        devOnly: false,
        options: [
            {
                name: "user",
                description: template.userArgDescr,
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
            let title: string | undefined = template.title;
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
                            interaction.member?.nick ||
                                interaction.user.username
                        )
                        .replace("{target}", target.username);
                } else {
                    description = arg.value as string;
                }
            }
            // uwu
            const imgURL = await getUwuUrl(template.name);
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
    };
}
