import { createCommand } from "./mod.ts";

import { wholesomeTemplate, generateWholesome } from "../utils/wholesome.ts";

const template: wholesomeTemplate = {
    name: "cry",
    description: "cry",
    userArgDescr: "cry to someone",
    title: "*crying*",
    title2: "*crying* to {target} !\n",
};

createCommand(generateWholesome(template));
