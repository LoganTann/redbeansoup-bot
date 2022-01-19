import { ApplicationCommandTypes, InteractionResponseTypes } from "../../deps.ts";
import * as helpers from "../utils/helpers.ts";
import { descalendrierEdt, descalendrierGroupes, getDescalendrier } from "../utils/descalendrier.ts";
import { createCommand } from "./mod.ts";

interface embedField {
  name: string,
  value: string,
  inline: boolean,
  _dateForSort: Date
};

function findEdt(group: string, groupList: descalendrierGroupes): descalendrierEdt[] {
  for (const category of groupList) {
    for (const catgroup of category.groupes) {
      if (catgroup.titre == group) {
        return catgroup.edt;
      }
    }
  }
}

async function getResult(edtList: descalendrierEdt[], dateToSee: Date): Promise<Array<embedField>>{
  let result = [];
  for (const edt of edtList) {
    const begin: Date = new Date(edt.start);
    if (begin.getMonth() != dateToSee.getMonth() || begin.getDate() != dateToSee.getDate()) continue;
    const hour = helpers.dateToDiscordTimestamp(begin, helpers.DiscordTimestampFlag.time);
    const teacher = helpers.pseudonymizeTeacher(edt.enseignant);
    const location = helpers.abbreviateBlockList(edt.location);
    result.push({
      name: edt.name,
      value: `**Heure**: ${hour}\n**Salle**: ${location}${teacher ? "\n**Ens**: " + teacher : ""}`,
      inline: true,
      _dateForSort: begin
    })
  }
  result.sort((a, b) => a._dateForSort.getTime() - b._dateForSort.getTime());
  return result;
}

createCommand({
  name: "edt",
  description: "Obtenez l'EDT depuis l'API de Descalendrier",
  type: ApplicationCommandTypes.ChatInput,  
  options: [
    {
      type: 3,
      name: "groupe",
      description: "Le nom du groupe à afficher",
      required: true, 
      choices: [
        { name: "Groupe 101", value: "101" }, { name: "Groupe 102", value: "102" }, 
        { name: "Groupe 103", value: "103" }, { name: "Groupe 104", value: "104" }, 
        { name: "Groupe 105", value: "105" }, { name: "Groupe 106", value: "106" }, 
        { name: "Groupe 107", value: "107" }, { name: "Groupe 108", value: "108" }, 
        { name: "Groupe 109", value: "109" }, { name: "Groupe 101", value: "110" }, 
        { name: "Groupe 111", value: "111" }, { name: "Groupe 112", value: "112" },
        { name: "Groupe 201", value: "201" }, { name: "Groupe 202", value: "202" },
        { name: "Groupe 203", value: "203" }, { name: "Groupe 204", value: "204" },
        { name: "Groupe 205", value: "205" }, { name: "Groupe 206", value: "206" },
        { name: "Groupe 207", value: "207" }, { name: "Groupe 208", value: "208" },
        { name: "Groupe 209", value: "209" }, { name: "Groupe APP", value: "Apprentissage" },
      ],
    },
    {
      type: 3,
      name: "date",
      description: "mettez n'imp si vous voulez la date de demain plutôt qu'aujourd'hui",
      required: false, 
      choices: [
        { name: "demain", value: "dm" }
      ],
    }
  ],

  execute: async (Bot, interaction, arg ) => {
    let embedOut;
    try {
      const group: string = interaction.data.options[0].value;
      const edtList: descalendrierEdt[] = findEdt(group, await getDescalendrier());
      let dateToSee = new Date();
      if (interaction.data.options.lenght > 1) {
        dateToSee.setDate(dateToSee.getDate() + 1);
      }
      embedOut = {
        title: `Emploi du Temps des ${group} pour le ${helpers.dateToDiscordTimestamp(dateToSee, helpers.DiscordTimestampFlag.date)}`,
        type: "rich",
        url: "https://edt.bde-faction.fr/",
        author: { name: "Descalendrier pour Discord", iconUrl: "https://edt.bde-faction.fr/favicon.png" },
        fields: await getResult(edtList, dateToSee),
        color: 14825785
      };
    } catch (error) {
      embedOut = {name: "Error", value: error, inline: false};
    }

    await Bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        data: {
          embeds: [embedOut]
        }
      }
    );
  }
});
