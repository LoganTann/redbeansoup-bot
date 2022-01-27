import { Bot } from "../../bot.ts";
import { configs } from "../../configs.ts";

export async function updateApplicationCommands() {
  const globalCommands = Bot.commands
    // ONLY GLOBAL COMMANDS
    .filter((command) => !command.devOnly)
    .array();

  const devCommands = Bot.commands
      // ONLY DEV COMMANDS
      .filter((command) => !!command.devOnly)
      .array();

  await Bot.helpers.upsertApplicationCommands(
    globalCommands
  );

  await Bot.helpers.upsertApplicationCommands(
    devCommands,
    configs.devGuildId,
  );
}
