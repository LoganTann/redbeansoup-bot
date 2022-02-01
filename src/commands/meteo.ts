import {
    ApplicationCommandTypes,
    InteractionResponseTypes,
    DiscordenoInteraction,
    Embed,
} from "../../deps.ts";
import { MeteoFranceClient, MeteoHelpers } from "../utils/descanicule.ts";
import { createCommand } from "./mod.ts";
import { BotClient } from "../../bot.ts";

createCommand({
    name: "meteo",
    description: "Demande à Descanicule la météo",
    type: ApplicationCommandTypes.ChatInput,
    devOnly: false,
    execute: async (Bot: BotClient, interaction: DiscordenoInteraction) => {
        let embedOut: Embed;
        try {
            const meteo = await MeteoFranceClient.getForecast();
            const out = MeteoHelpers.getForecastEmbedFields(meteo);
            embedOut = {
                description: "Voici les prévisions météo du campus !",
                type: "rich",
                url: "https://edt.bde-faction.fr/",
                author: {
                    name: "Descanicule pour Discord",
                    iconUrl:
                        "https://cdn.discordapp.com/emojis/938158210114801774.webp",
                },
                fields: out,
                color: 14825785,
            };
        } catch (error) {
            if (interaction.channelId) {
                Bot.helpers.sendMessage(interaction.channelId, {
                    content: "error " + error,
                });
            }
            return;
        }

        if (interaction.notASlashCommand) {
            if (interaction.channelId) {
                Bot.helpers.sendMessage(interaction.channelId, {
                    content:
                        "*:eyeglasses: utilisez les commandes slash si elles sont disponibles !*",
                    embeds: [embedOut],
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
                    embeds: [embedOut],
                },
            }
        );
    },
});
