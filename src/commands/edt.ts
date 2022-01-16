import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import { snowflakeToTimestamp } from "../utils/helpers.ts";
import { createCommand } from "./mod.ts";

function parseCellDescription(description: string) :string {
  const matches = description.match(/\n([A-Za-z_-]+)\s+([A-Za-z_-]+\s+)+/gm);
  if (matches) {
    return matches[0].replace(/  +/, " ").trim();
  }
  return "<< Pas de prof (ou erreur ?) >>";
}

/**
 * https://discord.com/developers/docs/reference#message-formatting-timestamp-styles
 * @param date the date to convert
 * @returns the discord timestamp tag of the date
 */
function dateToDiscordTimestamp(date :Date) :string {
  return `<t:${(new Date(date).getTime() / 1000).toFixed(0)}:R>`;
}

const group = 209;

/**
 * Extrais les données de descalendrier
 * @param calendar la réponse de l'api, https://descalendrier.jiveoff.fr/api/edt/XXX sous forme d'objet json
 */
function parseEdtResult(calendar: any) {
  const events = [];
  for (const [cellId, ev] of Object.entries(calendar)) {
    if (ev.type != "VEVENT") continue;
    ev.name = ev.summary;
    ev.start = new Date(ev.start);
    ev.description = parseCellDescription(ev.description);
    events.push(`${dateToDiscordTimestamp(ev.start)} - ${ev.name} => ${ev.description}`);
  }
  return events.join("\n");
}

createCommand({
  name: "edt",
  description: "Obtenez l'EDT depuis l'API de Descalendrier",
  type: ApplicationCommandTypes.ChatInput,  
  execute: async (Bot, interaction) => {
    let resultString;
    try {
      const jsonResponse = await fetch(`https://descalendrier.jiveoff.fr/api/edt/${group}`);
      const jsonData = await jsonResponse.json();
      resultString = parseEdtResult(jsonData);
    } catch (e) {
      resultString = e;
    }
    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `redbeansoup a regardé Descalendrier et vous donne un résultat trop joli : \n${resultString}`,
        },
      },
    );
  },
});
