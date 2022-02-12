import { DiscordenoMessage } from "../../../deps.ts";
import { SoupClient } from "../framework.ts";


/**
 * Uses the state pattern, based on refactoring.guru template
 */
export class Interaction {
    constructor(state: InteractionState) {
        this.transitionTo(state);
    }

    /**
     * @type {InteractionState} A reference to the current state of the interaction
     */
    private state !: InteractionState;


    /**
     * The Context allows changing the State object at runtime.
     */
    public transitionTo(state: InteractionState): void {
        this.state = state;
        this.state.setContext(this);
    }

    /**
     * Sends a message to the channel of which the interaction is happening.
     * @param message Text message to send
     */
    public reply(message: string) {
        this.state.reply(message);
    }
}

/**
 * The base State class declares methods that all Concrete State should
 * implement and also provides a backreference to the Context object, associated
 * with the State. This backreference can be used by States to transition the
 * Context to another State.
 */
abstract class InteractionState {
    protected context!: Interaction;
    public setContext(context: Interaction) {
        this.context = context;
    }

    public abstract reply(message: string): void;
}

/**
 * Concrete States implement various behaviors, associated with a state of the
 * Context.
 */
export class SlashInteraction extends InteractionState {
    public reply(message: string): void {
        throw "cannot reply from slash, not implemented. Message: " + message;
    }
}

export class MessageInteraction extends InteractionState {
    constructor(private client: SoupClient, private interaction: DiscordenoMessage) {
        super();
    }
    public reply(message: string): void {
        this.client.sendMessage(this.interaction.channelId, {
            content: message,
            messageReference: {
                messageId: this.interaction.id,
                channelId: this.interaction.channelId,
                guildId: this.interaction.guildId,
                failIfNotExists: false,
            },
        });
    }
}