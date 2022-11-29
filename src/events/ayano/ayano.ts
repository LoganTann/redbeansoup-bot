
import { myOpenAi } from "../../../configs.ts";
import { AyanoStorage } from "./ayanoStorage.ts";
import { getWebhook } from "../../database/getWebhook.ts";
import { addReaction, removeReaction} from "../../../deps.ts";

// constants
export const AYANO_CMD_PREFIX = "$ayano";
const loadingEmote = "<a:loading:986003246776721478>";

async function sendWebhookAsAyano(bot, interaction, content) {
    const webhook = await getWebhook(bot, interaction);
    try {
        bot.helpers.sendWebhook(webhook.id, webhook.token, {
            content,
            avatarUrl: "https://media.discordapp.net/attachments/961323014966878208/985998983505801216/unknown.png",
            username: "Ayano",
        });
    } catch (e) {
        bot.helpers.sendMessage(interaction.channelId, {
            content,
            messageReference: {
                messageId: interaction.id,
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                failIfNotExists: false,
            },
        });
        console.error("OH NOO");
    }
}

export async function runAyano(bot, interaction) {
    const ayanoInstance = AyanoStorage.getInstance();
    const prompt = interaction.content.replace(new RegExp('\\n|\\'+AYANO_CMD_PREFIX, "gm"), " ").trim();

    if (prompt.startsWith("clear") || prompt.startsWith("logs")) {
        let debugcontent;
        if (prompt.startsWith("clear")) {
            ayanoInstance.clear();
            debugcontent = "I have been through a timeline reset\nSee you again !";
        } else {
            debugcontent = "debug : ```\n"+ayanoInstance.buildRequest("")+"\n```";
        }
        
        bot.helpers.sendMessage(interaction.channelId, {
            content: debugcontent,
            messageReference: {
                messageId: interaction.id,
                channelId: interaction.channelId,
                guildId: interaction.guildId,
                failIfNotExists: false,
            },
        });
        return;
    }

    await addReaction(bot, interaction.channelId, interaction.id, loadingEmote);
    let discordOutput = "";
    try {
        const processedPrompt = ayanoInstance.buildRequest(prompt);
        const AiResponse: Response = await myOpenAi.createCompletion(processedPrompt, "text-curie-001", 0.5, 70, 1, 0.5, 0, ['###', '[Logan]']);
        const AiSentence = AiResponse.choices[0].text;
        discordOutput += AiSentence;
        ayanoInstance.saveInteraction(prompt, AiSentence);
    } catch (e) {
        discordOutput = "Error : " + e.toString();
        console.error(e);
    }

    await sendWebhookAsAyano(bot, interaction, discordOutput);
    await removeReaction(bot, interaction.channelId, interaction.id, loadingEmote);
}
