export class RollAwaken extends Roll {
    static CHAT_TEMPLATE = "systems/awaken/templates/dice/roll.html";
    static PRODIGE_TEMPLATE = "systems/awaken/templates/dice/roll-prodige.html";
    static COMBAT_TEMPLATE = "systems/awaken/templates/dice/roll-combat.html";

    constructor(formula, data = {}, options = {}) {
        super(formula, data, options);

        this.awaken = {
            label: "",
            success:"",
            hasCritique:false,
            hasFail:false,
            notRoll:false,
            hasDifficulte:false,
            difficulte:0,
            isProdige:false,
            prodigeType:"",
            prodigeActivation:"",
            prodigeDuree:"",
            prodigeDescription:"",
            isCombat:false,
            isAttaque:false,
            isDefense:false,
            combatArme:"",
            combatType:"",
            combatTypeDegats:"",
            combatDgts:"",
            combatDescription:"",
        }
    }

    async render(chatOptions = {}) {
        let template = this.constructor.CHAT_TEMPLATE;

        if(this.awaken.isProdige) { template = this.constructor.PRODIGE_TEMPLATE; }
        if(this.awaken.isCombat) { template = this.constructor.COMBAT_TEMPLATE; }

        chatOptions = foundry.utils.mergeObject(
            {
                user: game.user.id,
                flavor: null,
                template: template,
                blind: false,
            },
            chatOptions
        );

        const isPrivate = chatOptions.isPrivate;

        // Execute the roll, if needed
        if (!this._evaluated) {
            await this.roll();
        }

        let toolTip = await this.getTooltip({ from: "render" });

        if(this._total > 1) {
            this.awaken.success = game.i18n.localize(CONFIG.AWAKEN.roll["success"]);
        } else {
            this.awaken.success = game.i18n.localize(CONFIG.AWAKEN.roll["succes"]);
        }

        if(this._total >= 5) {
            this.awaken.hasCritique = true;
        }

        if(this._total === 0) {
            this.terms.forEach((dices) => {
                let list = [];

                if(dices?.results) {
                    for(let i = 0;i < dices.results.length;i++) {
                        list.push(dices.results[i].result);
                    }
                }


                if(list.filter(x => x==1).length >= 1) {
                    this.awaken.hasFail = true;
                }
            });
        }

        // Define chat data
        const chatData = {
            formula: isPrivate ? "???" : this._formula,
            flavor: isPrivate ? null : chatOptions.flavor || this.options.flavor,
            user: chatOptions.user,
            isPublicRoll: !isPrivate,
            tooltip: isPrivate ? "" : toolTip,
            total: isPrivate ? "?" : Math.round(this._total * 100) / 100,
            data: this.data,
            awaken: isPrivate
                ? {
                    label: "???"
                }
                : {
                      ...this.awaken
                  },
        };


        // Render the roll display template
        return renderTemplate(chatOptions.template, chatData);
    }

    async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
        // Perform the roll, if it has not yet been rolled
        if (!this._evaluated) {
            await this.evaluate({async:true});
        }

        // RollMode
        const rMode = rollMode || messageData.rollMode || game.settings.get("core", "rollMode");
        if (rMode) {
            messageData = ChatMessage.applyRollMode(messageData, rMode);
        }

        // Prepare chat data
        const msg = foundry.utils.mergeObject(messageData,
            {
                user: game.user.id,
                type: CONST.CHAT_MESSAGE_TYPES.ROLL,
                content: this._total,
                sound: CONFIG.sounds.dice
            }
        );
        msg.roll = this;

        // Either create the message or just return the chat data
        const message = await ChatMessage.create(msg, {
            rollMode: rMode
        });

        return create ? message : message.data;
    }

    /** @override */
    static fromData(data) {
        const roll = super.fromData(data);

        roll.data = data.data;
        roll.awaken = data.awaken;

        return roll;
    }

    toJSON() {
        const json = super.toJSON();

        json.data = foundry.utils.duplicate(this.data);
        json.awaken = foundry.utils.duplicate(this.awaken);

        return json;
    }
}