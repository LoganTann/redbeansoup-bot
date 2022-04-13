import { dotEnvConfig } from "./deps.ts";

// Load the .env file
dotEnvConfig();

export interface Config {
  token: string;
  botId: bigint;
}

const env: Record<string, string> = {
  BOT_TOKEN: Deno.env.get("BOT_TOKEN") || "",
  DEV_GUILD_ID: Deno.env.get("DEV_GUILD_ID") || "",
  clientId: Deno.env.get("clientId") || ""
};
for (const envKey in env) {
  if (env[envKey] === "") {
    throw "Missing env variable: " + envKey;
  }
}

export const configs = {
  /** Get token from ENV variable */
  token: env.BOT_TOKEN,
  /** Get the BotId from the token */
  botId: BigInt(atob(env.BOT_TOKEN.split(".")[0])),
  /** The server id where you develop your bot and want dev commands created. */
  devGuildId: BigInt(env.DEV_GUILD_ID),
  prefix: "$",
};
