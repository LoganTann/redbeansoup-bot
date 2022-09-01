import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "slap",
    description: "slap",
    userArgDescr: "The user to give the slap to",
    title: "*slap*",
    title2: "giving a slap to {user}\n",
};

createCommand(generateWholesome(template));
