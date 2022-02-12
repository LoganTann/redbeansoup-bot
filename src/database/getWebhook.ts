import {
    Bot,
    createWebhook,
    DiscordenoMessage,
    DiscordenoWebhook,
} from "../../deps.ts";
import { webhooksSchema, webhooks } from "./mod.ts";

/**
 * Once a webhook is created, its token is stored in database.
 * This function translates the token to an actual webhook object. 
 * @param entry A row from the database of type webhooksSchema
 * @returns an object of type DiscordenoWebhook
 */
function unserializeWebhook(
    entry: webhooksSchema | undefined
): DiscordenoWebhook {
    if (!entry) {
        throw new Error("Webhook not found");
    }
    return {
        id: entry.id,
        token: entry.token,
        type: 1,
    };
}

/**
 * Creates (or retrieves if cached) a webhook object for the channel in which the message was sent.
 * Uses a simple way to cache the webhook token (but unsafe, since channelId as primary key,
 * there is a very small probability that two servers could have two identical channelId).
 * @param bot The reference to the bot instance
 * @param interaction The message object that triggered the event
 * @returns a promise that gives a usable discordeno webhook object for the channel in which the message was sent.
 */
export async function getWebhook(
    bot: Bot,
    interaction: DiscordenoMessage
): Promise<DiscordenoWebhook> {
    const channelId: string = interaction.channelId.toString();
    if (await webhooks.has(channelId)) {
        return unserializeWebhook(await webhooks.get(channelId));
    }

    const createdWH: DiscordenoWebhook = await createWebhook(
        bot,
        interaction.channelId,
        {
            name: "Redbeansoup reaction",
            avatar: "https://cdn.discordapp.com/app-icons/542439267184672798/41ab1a2f6e1b3af7656666733a81a38b.png?size=512",
        }
    );
    await webhooks.set(channelId, {
        id: createdWH.id,
        token: createdWH.token,
    });

    return unserializeWebhook(await webhooks.get(channelId));
}
