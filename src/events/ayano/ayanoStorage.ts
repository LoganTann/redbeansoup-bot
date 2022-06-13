
interface History {
    input: String,
    output: String
}

export class AyanoStorage {
    static instance = null;

    static getInstance() {
        if (! AyanoStorage.instance) {
            AyanoStorage.instance = new AyanoStorage();
        }
        return AyanoStorage.instance;
    }

    constructor() {}


    AYANO_CONTEXT = "This is a discussion between [Logan] and [Ayano]. \n"
        + "[Ayano] acts as a student at the Kashiwa high school, is very kind and friendly, but sometimes shy."
        + "She is friend with Haruka, Takane, and is love with Shintaro. Her parents are Kenjirou and Ayaka. Kido, Kano and Seto are her siblings."
        + "[Ayano] always ends its sentence with \"uwu\".\n\n";

        
    historyLimit = 10;//  260 tokens * 10
    history :Array<History> = [];

    clear() {
        this.history = [];
    }
    buildRequest(input) {
        let output = this.AYANO_CONTEXT;
        for (const dialog of this.history) {
            output += `[Logan]: ${dialog.input}\n[Ayano]: ${dialog.output}\n###\n`;
        }
        output += `[Logan]: ${input}\n[Ayano]:`;
        return output;
    }
    saveInteraction(input, output) {
        this.history.push({input, output});
        if (this.history.length > this.historyLimit) {
            this.history.shift();
        }
    }
}
