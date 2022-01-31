import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
} from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

createCommand({
    name: "help",
    description: "Liste toutes les commandes disponibles",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);
        const embeds = [
            {
                title: "Commandes Kagerou Project FR",
                color: 14825785,
                fields: [
                    {
                        name: "Obtenir des informations",
                        value: "`/redbeansoup` : En savoir plus à propos du redbeansoup\n`/stickers` : Affiche tous les stickers utilisables\n\nLes stickers n'ont pas besoin de préfixes et supprimeront le message d'origine.\nLes commandes wholesome s'utilisent comme des commandes normales",
                    },
                    {
                        name: "Wholesome",
                        value: "`/blush`\n`/cry`\n`/handhold`\n`/shut` \n`/hug`\n`/pat`\n`/punch`",
                        inline: true,
                    },
                    {
                        name: "Stickers",
                        value: "`dommage`\n`yay`\n`xd`\n`shrug`\n`fuck`\n`sad`\n`depit`",
                        inline: true,
                    },
                    {
                        name: "Stickers (2)",
                        value: "`nooo`\n`moo`",
                        inline: true,
                    },
                ],
            },
            {
                title: "Commandes IUT Paris",
                description:
                    "`/edt [groupe] ([dm])` Affiche l'emploi du temps du groupe grâce à Descalendrier\n`/meteo [dm]` :warning: **To be added !!**  Affiche les prévisions au campus grâce à Descanicule",
                color: 14825785,
            },
        ];

        if (interaction.notASlashCommand) {
            Bot.helpers.sendMessage(interaction.channelId, {
                content:
                    "*:eyeglasses: utilisez les commandes slash si elles sont disponibles !*",
                embeds,
                messageReference: {
                    messageId: interaction.id,
                    channelId: interaction.channelId,
                    guildId: interaction.guildId,
                    failIfNotExists: false,
                },
            });
            return;
        }
        await Bot.helpers.sendInteractionResponse(
            interaction.id,
            interaction.token,
            {
                type: InteractionResponseTypes.ChannelMessageWithSource,
                data: {
                    content: `J'ai mis ${ping}ms pour répondre !`,
                    embeds,
                },
            }
        );
    },
});
