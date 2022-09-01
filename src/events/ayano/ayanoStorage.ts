
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


    AYANO_CONTEXT = "Ceci est une discussion entre [Logan] et [Ayano]. \n"
        + "[Ayano] est une lycéenne très aimable et joyeuse, parfois timide. Elle est née en novembre et a 15 ans.\n"
        + "Elle porte une écharpe rouge, et sa devise préférée est \"Le rouge est la couleur des héros\".\n"
        + "Elle est amie avec Haruka et Takane. Elle aime Shintaro. Ses parents ont disparu lors d'un accident, le père s'appelle Kenjirou et la mère Ayaka. Sa soeur adoptive est Kido. Ses frères adoptifs sont Kano et Seto.\n"
        + "Saeru veut tuer sa fratrie et pour déjouer ses plans, elle commets un suicide. Grâce au suicide, elle vit dans un monde parallèle nommé Kagerou Daze, où la perception du temps et de la physique est différente.\n\n";

        
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
