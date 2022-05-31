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
        }, 1000 * 60 * 60 * 24);
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
    
    async load() {
        try {
            const jsonString = await Deno.readTextFile(this.path);
            this.emojis = JSON.parse(jsonString);
        } catch (e) {
            console.error("[EmojiStorage > Load err]", e);
            this.emojis = {};
        }
        console.log("[EmojiStorage > Loaded]", this.emojis );
    }

    getEmojis(guildId){
        const emojisRef = this.emojis[guildId] || {};
        return Object.keys(emojisRef)
            .sort((aLabel, bLabel) => emojisRef[aLabel] - emojisRef[bLabel])
            .splice(0, 10)
            .reverse()
            .map((label, i) => `\`${i+1}.\` ${label} : ${emojisRef[label]}` )
            .join("\n");
    }
};