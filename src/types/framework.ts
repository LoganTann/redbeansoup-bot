/**
 * Redbeansoup internal framework.
 * This adds more flexibility but respects less the discord API architecture.
 * @author LoganTann
 */

import { Bot, BotClient } from "../../bot.ts";
import {
  ApplicationCommandOption,
  ApplicationCommandTypes,
  CreateMessage,
DiscordenoMessage,
} from "../../deps.ts";
import log from "../utils/logger.ts";
import { Interaction, MessageInteraction } from "./framework/interaction.ts";


export class SoupClient {
  commands: SoupCommand[] = [];
  bot: BotClient;
  public registerCommand(commandReference: SoupCommand) {
    log.info(`SoupClient > Registering command ${commandReference.name}`);
    this.commands.push(commandReference);
  }
  static initialized = false;
  // todo : Not rely on BotClient
  constructor(bot: BotClient) {
    this.bot = bot;
    if (SoupClient.initialized) {
        log.warn("SoupClient > An instance of SoupClient already exists. Import soup instead of creating it.");
    }
    SoupClient.initialized = true;
  }
  public onMessage(message: DiscordenoMessage) {
      for (const cmd of this.commands) {
          cmd.onMessage(this, message);
      }
  }

  // todo : promisify
  public sendMessage(channelId: bigint, message: CreateMessage) {
    this.bot.helpers.sendMessage(channelId, message);
  }
  // todo store commands
  // todo store bot
}

export const soup = new SoupClient(Bot);

interface commandMetadata {
  name: string;
  group: string;
  description: string;
  mdDescription: string;
  examples: string[];
  devOnly: boolean;
}

export abstract class SoupCommand implements commandMetadata {
  constructor() {
  }
  name = "";
  group = "";
  description = "";
  mdDescription = "";
  devOnly = false;
  examples!: string[];

  /** The type of command this is. */
  type = ApplicationCommandTypes.ChatInput;

  /** The options for this command */
  options?: ApplicationCommandOption[];


  
  onMessage(client: SoupClient, msg: DiscordenoMessage) {
      if (msg.isBot) {
          return;
      }
      if (msg.content.trim().startsWith("!"+this.name)) {
          const msgInt = new MessageInteraction(client, msg);
          this.run(new Interaction(msgInt));
      }
  }
  
  /** This will be executed when the command is run. */
  run(interaction: Interaction) {
    interaction.reply(`${this.name} is not implemented yet.`);
  }
}
