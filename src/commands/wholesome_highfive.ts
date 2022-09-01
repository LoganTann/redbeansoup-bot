import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "highfive",
    description: "highfive",
    userArgDescr: "The user to give the highfive to",
    title: "*highfive*",
    title2: "giving a highfive to {user}\n",
};

createCommand(generateWholesome(template));
