import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "punch",
    description: "punch someone",
    userArgDescr: "the person to punch",
    title: "*punch*",
    title2: "punching {target} !\n",
};

createCommand(generateWholesome(template));
