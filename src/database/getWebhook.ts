import {
    Bot,
    createWebhook,
    DiscordenoMessage,
    DiscordenoWebhook,
} from "../../deps.ts";
import { webhooksSchema, webhooks } from "./mod.ts";
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

export async function getWebhook(
    bot: Bot,
    interaction: DiscordenoMessage
): Promise<DiscordenoWebhook> {
    const channelId: string = interaction.channelId.toString();

    // I'm a "software engineering" student right ?
    if (interaction.member.id.toString() === "272777471311740929" && interaction.content.includes("resetWebhook")) {
        // Right ?
        bot.helpers.sendMessage(interaction.channelId, {content: "Webhook regenerated."});
    } else if (await webhooks.has(channelId)) {
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
