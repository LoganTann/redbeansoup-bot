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
                        name: "Stickers (1/2)",
                        value: "`dommage`\n`yay`\n`xd`\n`shrug`\n`fuck`\n`sad`\n`depit`",
                        inline: true,
                    },
                    {
                        name: "Stickers (2/2)",
                        value: "`nooo`\n`moo`",
                        inline: true,
                    },
                ],
            },
            {
                title: "Commandes Paris Descartes",
                fields: [
                    {
                        name: "<:descalendrier:938194213470883931> Descalendrier",
                        value: "Usage : `/edt [groupe] ([dm])`\n\nAffiche l'emploi du temps d'un groupe. Utilise l'API du site [Descalendrier](https://edt.bde-faction.fr) (crée par @JiveOff)",
                        inline: true,
                    },
                    {
                        name: "<:p13j:938158210114801774> Descanicule",
                        value: "Usage : `/meteo`\n\nAffiche la météo du campus en temps réel. Utilise l'API privée de MeteoFrance ([Client](https://github.com/LoganTann/redbeansoup-bot/blob/main/src/utils/descanicule.ts#L11) par @ShinProg)",
                        inline: true,
                    },
                ],
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
