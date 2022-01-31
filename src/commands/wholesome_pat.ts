import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "pat",
    description: "Give a pat to someone",
    userArgDescr: "user to pat",
    title: "*pat pat*",
    title2: "{user} has given a pat to {target}\n",
};

createCommand(generateWholesome(template));
