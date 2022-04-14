import {
    Bot as BotInterface,
    DiscordenoMessage,
    DiscordenoWebhook,
    getUser,
    avatarURL,
    Embed,
    deleteMessage,
    openai
} from "../../deps.ts";

import { myOpenAi } from "../../configs.ts";

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
    const username = interaction.member?.nick || user.username;
    const webhook: DiscordenoWebhook = await getWebhook(bot, interaction);
    if (!webhook.token) {
        log.error(`Could not get webhook in ${interaction.channelId}`);
        return;
    }
    const embed: Embed = {
        description: `${username} reacted *${stickerID}*`,
        image: { url: stickerList[stickerID] },
    };
    Bot.helpers.sendWebhook(webhook.id, webhook.token, {
        content: "",
        avatarUrl,
        username,
        embeds: [embed],
    });
    await deleteMessage(
        bot,
        interaction.channelId,
        interaction.id,
        "message replaced by a sticker"
    );
}


const OPENAI_CMD_PREFIX = "$momo";
/**
 * Asks the AI to autocomplete the sentence
 */
async function runOpenai(bot: BotInterface, interaction: DiscordenoMessage) {
    const prompt = interaction.content.replace(new RegExp('\\n|\\'+OPENAI_CMD_PREFIX, "gm"), " ").trim();
    let result = "Error : ";
    try {
        const response: Response = await myOpenAi.createCompletion(prompt, "text-davinci-002", 0.3, 256);
        result = response.choices.map(choice => choice.text).join("\n");
    } catch (e) {
        result += e.toString();
        console.error(e);
    }
    
    Bot.helpers.sendMessage(interaction.channelId, {
        content:
            result + "\n*Voir toutes les possibilités sur beta.openai.com*",
        messageReference: {
            messageId: interaction.id,
            channelId: interaction.channelId,
            guildId: interaction.guildId,
            failIfNotExists: false,
        },
    });
}

Bot.events.messageCreate = async (bot, interaction) => {
    if (interaction.isBot) {
        return;
    }
    //
    await stickers(bot, interaction);

    
    if (interaction.content.startsWith(OPENAI_CMD_PREFIX)) {
        await runOpenai(bot, interaction);
        return;
    }

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
