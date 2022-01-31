import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "handhold",
    description: "hold the hand of someone",
    userArgDescr: "hold the hand of *that* person",
    title: "*holding hands*",
    title2: "holding hands of {target} !\n",
};

createCommand(generateWholesome(template));
