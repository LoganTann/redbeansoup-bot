import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "blush",
    description: "blush",
    userArgDescr: "** TODO : remove this option **",
    title: "*blush*",
    title2: "{user} blushes\n",
};

createCommand(generateWholesome(template));
