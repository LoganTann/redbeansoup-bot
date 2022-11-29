import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
} from "../../deps.ts";
import { createCommand } from "./mod.ts";

createCommand({
    name: "help",
    description: "Liste toutes les commandes disponibles",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot, interaction) => {
        const embeds = [
            {
                title: "OpenAI",
                color: 14825785,
                fields: [
                    {
                        name: "`$momo`",
                        value: "Usage : `$momo`\n\nréagir avec GPT-3, grâce à l'[API Beta d'OpenAI](https://beta.openai.com/examples)",
                        inline: true
                    },
                    {
                        name: "`$ayano`",
                        value: "Usage : `$ayano [clear|<prompt>]`\n\n le `$momo` mais qui tente de se comporter comme un tchatbot",
                        inline: true
                    }
                ]
            },
            {
                title: "Commandes de serveurs Kagerou Project FR",
                color: 14825785,
                fields: [
                    {
                        name: "Obtenir des informations",
                        value: "`/redbeansoup` : En savoir plus à propos du redbeansoup\n`/stickers` : Affiche tous les stickers utilisables\n\nLes stickers n'ont pas besoin de préfixes et supprimeront le message d'origine.\nLes commandes wholesome s'utilisent comme des commandes normales",
                    },
                    {
                        name: "Wholesome (1/2)",
                        value: "`/blush`\n`/cry`\n`/handhold`\n`/shut`",
                        inline: true,
                    },
                    {
                        name: "Wholesome (2/2)",
                        value: "\n`/hug`\n`/pat`\n`/punch`",
                        inline: true,
                    },
                ],
            },
            {
                title: "Commandes de serveurs IUT Paris Descartes",
                fields: [
                    {
                        name: "Descalendrier",
                        value: "Usage : `/edt [groupe] ([dm])`\n\nAffiche l'emploi du temps d'un groupe. Utilise l'API du site [Descalendrier](https://edt.bde-faction.fr) (crée par @JiveOff)",
                        inline: true,
                    },
                    {
                        name: "Descanicule",
                        value: "Usage : `/meteo`\n\nAffiche la météo du campus en temps réel. Utilise l'API privée de MeteoFrance ([Client](https://github.com/LoganTann/redbeansoup-bot/blob/main/src/utils/descanicule.ts#L11) par @ShinProg)",
                        inline: true,
                    }
                ],
                color: 14825785,
            },
            {
                title: "Note de déprécation",
                fields: [
                    {
                        name: "Ceci est la version 1 du bot, codée avec les pieds",
                        value: "Participez au développement de la version 2 sur https://github.com/LoganTann/redbeansoup-v2/"
                    }
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
                    embeds,
                },
            }
        );
    },
});
