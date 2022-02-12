import {soup, SoupCommand} from "../types/framework.ts";
import { Interaction } from "../types/framework/interaction.ts";

class redbeansoup extends SoupCommand {
    name = "redbeansoup";
    group = "infos";
    description = "En savoir plus à propos de redbeansoup";
    examples = ["redbeansoup"];

    run (interaction: Interaction) {
        interaction.reply(`Le framework soup semble fonctionnel :)`);
    }
}

soup.registerCommand(new redbeansoup());