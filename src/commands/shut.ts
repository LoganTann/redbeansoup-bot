import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "chut",
    description: "shhh",
    userArgDescr: "person to be silenced",
    title: "*shhhh !*",
    title2: "shhh, {target} !\n",
};

createCommand(generateWholesome(template));
