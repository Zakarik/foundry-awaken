/**
 * Extend the base Item document to support attributes and groups with a custom template creation dialog.
 * @extends {Item}
 */
export class AwakenItem extends Item {
    static async create(data, options = {}) {
        // Replace default image
        if (data.img === undefined) {

            switch(data.type) {
                case "equipement":
                    data.img = "systems/awaken/assets/icons/equipement.svg";
                    break;

                case "armement":
                    data.img = "systems/awaken/assets/icons/armement.svg";
                    break;

                case "armure":
                    data.img = "systems/awaken/assets/icons/armure.svg";
                    break;

                case "prodige":
                    data.img = "systems/awaken/assets/icons/prodige.svg";
                    break;

                case "specialisation":
                    data.img = "systems/awaken/assets/icons/specialisation.svg";
                    break;

                case "reputation":
                    data.img = "systems/awaken/assets/icons/reputation.svg";
                    break;
            }
            
        }

        await super.create(data, options);
    }
}
