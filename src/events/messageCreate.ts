import {
    Bot as BotInterface,
    DiscordenoMessage,
    DiscordenoWebhook,
    getUser,
    avatarURL,
    Embed,
    deleteMessage,
} from "../../deps.ts";
import { Bot } from "../../bot.ts";
import log from "../utils/logger.ts";
import { getWebhook } from "../database/getWebhook.ts";
import stickerList from "../stickerlist.ts";

/**
 * replace someone's message by looking at the stickerlist
 * @param bot The reference to the bot instance
 * @param interaction The message object that triggered the event
 * @returns void
 */
async function stickers(bot: BotInterface, interaction: DiscordenoMessage) {
    const stickerID = interaction.content.trim().toLowerCase();
    if (typeof stickerList[stickerID] !== "string") {
        return; // no matches
    }
    log.info("Sticker found: " + stickerID);

    const user = await getUser(bot, interaction.authorId);
    const avatarUrl = avatarURL(bot, user.id, user.discriminator, {
        avatar: user.avatar,
    });

    const webhook: DiscordenoWebhook = await getWebhook(bot, interaction);
    if (!webhook.token) {
        log.error(`Could not get webhook in ${interaction.channelId}`);
        return;
    }
    const embed: Embed = {
        description: `... reacted *${stickerID}*`,
        image: { url: stickerList[stickerID] },
    };
    Bot.helpers.sendWebhook(webhook.id, webhook.token, {
        content: "",
        avatarUrl,
        username: interaction.member?.nick || user.username,
        embeds: [embed],
    });
    await deleteMessage(
        bot,
        interaction.channelId,
        interaction.id,
        "message replaced by a sticker"
    );
}

Bot.events.messageCreate = async (bot, interaction) => {
    if (interaction.isBot) {
        return;
    }
    //
    await stickers(bot, interaction);

    const result = interaction.content.match(/^\s*\$(\w+)(.+)?/) || [];
    if (result.length < 3) {
        return;
    }
    if (typeof result[2] === "undefined") {
        result[2] = "";
    }

    const command = bot.commands.get(result[1]);
    if (command) {
        interaction.data = {
            options: result[2]
                .trim()
                .split(" ")
                .map((a) => {
                    return { value: a };
                }),
        };
        interaction.notASlashCommand = true;
        command.execute(bot, interaction);
    } else {
        Bot.helpers.sendMessage(interaction.channelId, {
            content: `Commande inconnue: ${result[1]}`,
        });
    }
};
