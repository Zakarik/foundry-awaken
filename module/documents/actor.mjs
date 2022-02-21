/**
 * Extend the base Actor document to support attributes and groups with a custom template creation dialog.
 * @extends {Actor}
 */
export class AwakenActor extends Actor {

  /**
     * Create a new entity using provided input data
     * @override
     */
  static async create(data, options = {}) {
    // Replace default image
    if (data.img === undefined) {
        data.img = "icons/svg/mystery-man-black.svg";
    }
    await super.create(data, options);
  }

  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  prepareDerivedData() {
    const actorData = this.data;
    const context = actorData.data;   
    
    const physique = +context.attributs.physique.value;
    const agilite = +context.attributs.physique.competences.agilite.value;
    const melee = +context.attributs.physique.competences.melee.value;
    const armeDistance = +context.attributs.physique.competences.armesDistance.value;
    const wpnMainsNues = +context?.combat?.bonus?.mainsNues || 0;
    const wpnContact = +context?.combat?.bonus?.contact || 0;
    const wpnDistance = +context?.combat?.bonus?.distance || 0;
    const armorBonus = +context?.reserves?.bonus?.armure || 0;
    const modEnd = +context.endurance.modificateur;
    const corruption = +context.corruption.value;

    let totalEnd = physique+3+modEnd;
    let maxEnd = 0;
    let malus = 0;

    switch(corruption) {
      case 7:
        maxEnd = 9;
        break;

      case 8:
        maxEnd = 8;
        break;

      case 9:
        maxEnd = 7;
        break;

      case 10:
        maxEnd = 6;
        break;

      case 11:
        maxEnd = 5;
        malus = -1;
        break;

      case 12:
        maxEnd = 4;
        malus = -2;
        break;

      case 13:
        maxEnd = 3;
        malus = -3;
        break;

      case 14:
        maxEnd = 2;
        malus = -3;
        break;

      case 15:
        maxEnd = 1;
        malus = -4;
        break;

      default:
        maxEnd = -1
        break;
    }

    if(maxEnd != -1) {
      totalEnd = Math.min(totalEnd, maxEnd);
    }

    context.combat = {};
    context.combat.mainsNues = physique+agilite+melee+armorBonus+wpnMainsNues;
    context.combat.auContact = physique+agilite+melee+wpnContact;
    context.combat.aDistance = physique+armeDistance+wpnDistance;
    context.endurance.value = totalEnd;
    context.corruption.malus = malus;
  }
}