import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import * as helpers from "../utils/helpers.ts";
import { descalendrierEdt, descalendrierGroupes, getDescalendrier } from "../utils/descalendrier.ts";
import { createCommand } from "./mod.ts";

interface embedField {
  name: string,
  value: string,
  inline: boolean
};

const group = "209";
function findEdt(group: string, groupList: descalendrierGroupes): descalendrierEdt[] {
  for (const category of groupList) {
    for (const catgroup of category.groupes) {
      if (catgroup.titre == group) {
        return catgroup.edt;
      }
    }
  }
}
async function getResult(): Promise<Array<embedField>>{
  const edtList: descalendrierEdt[] = findEdt(group, await getDescalendrier());
  let result = [];
  for (const edt of edtList) {
    const begin: Date = new Date(edt.start);
    const hour = helpers.dateToDiscordTimestamp(begin, helpers.DiscordTimestampFlag.time);
    const tmpdate = helpers.dateToDiscordTimestamp(begin, helpers.DiscordTimestampFlag.date);
    const teacher = helpers.pseudonymizeTeacher(edt.enseignant);
    const location = helpers.abbreviateBlockList(edt.location);
    result.push({
      name: edt.name + ' ' + tmpdate,
      value: `**Heure**: ${hour}${teacher ? "\n**Ens**: "+teacher : ""}\n**Salle**: ${location}`,
      inline: true
    })
  }
  return result;
}

createCommand({
  name: "edt",
  description: "Obtenez l'EDT depuis l'API de Descalendrier",
  type: ApplicationCommandTypes.ChatInput,  

  arguments: [

  ],

  execute: async (Bot, interaction) => {
    let result;
    try {
      result = await getResult();
    } catch (error) {
      result = [{name: "Error", value: error, inline: false}];
    }

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          content: `tmp`,
          embeds: [{
            title: "EDT",
            type: "rich",
            url: "https://edt.bde-faction.fr/",
            author: "Descalendrier for Discord",
            fields: result
          }]
        }
      }
    );
  }
});
