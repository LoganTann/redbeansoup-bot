import numberToEmoji from "./numberToEmoji.ts";

export default class EmojiStorage {

    static instance = null;

    static getInstance() {
        if (! EmojiStorage.instance) {
            EmojiStorage.instance = new EmojiStorage();
        }
        return EmojiStorage.instance;
    }

    constructor() {
        this.load();

        setInterval(() => {
            this.save();
        }, 1000 * 60 * 60);
    }

    path = "./EmojiStorage.json";
    emojis = {}

    incrementEmoji(guildId, emojiName) {
        if (! this.emojis[guildId]) {
            this.emojis[guildId] = {};
        }
        if (! this.emojis[guildId][emojiName]) {
            this.emojis[guildId][emojiName] = 0;
        }
        this.emojis[guildId][emojiName]++;
    }

    async save() {
        const jsonString = JSON.stringify(this.emojis, undefined, 4);
        try {
            await Deno.writeTextFile(this.path, jsonString);
        } catch (e) {
            console.error("[EmojiStorage > save write] : ", e);
        }
        console.log("[EmojiStorage > save] : ", jsonString);
    }
    
    load() {
        try {
            const jsonString = Deno.readTextFileSync(this.path);
            this.emojis = JSON.parse(jsonString);
        } catch (e) {
            console.error("[EmojiStorage > Load err]", e);
            this.emojis = {};
        }
        console.log("[EmojiStorage > Loaded]");
    }

    getEmojis(guildId){
        const emojisRef :Record<string, number> = this.emojis[guildId] || {":x:": 0};
        try {
            return Object.entries(emojisRef)
                .sort((a, b) => b[1] - a[1])
                .map((emoji, i) => {
                    if (i > 9) return undefined;
                    return `${numberToEmoji(i+1)} - ${emoji[0]} : ${emoji[1]}`
                } )
                .join("\n");
        } catch(e) {
            return "Error : " + e;
        }
    }
};