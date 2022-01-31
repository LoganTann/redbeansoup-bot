import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "hug",
    description: "Give a hug to someone",
    userArgDescr: "user to hug",
    title: "*big hug*",
    title2: "{user} has given a hug to {target}\n",
};

createCommand(generateWholesome(template));
