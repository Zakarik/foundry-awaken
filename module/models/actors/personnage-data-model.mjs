import Actors_Models from '../parts_models.mjs';

export class PJDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, NumberField, HTMLField} = foundry.data.fields;

        const parts = new Actors_Models();

        let data = {
            personnalite: new StringField({initial:""}),
            origine:  new StringField({initial:""}),
            ordre:  new StringField({initial:""}),
            description:  new HTMLField({initial:""}),
            richesse: new NumberField({initial:0}),
            armement: parts.armement(),
            armure: parts.armure(),
            combat: parts.combat(),
            corruption: parts.corruption(),
            vitalite: parts.vitalite(),
            endurance: parts.endurance(),
            reserves: parts.reserves(),
            vertus:  parts.vertus(),
            attributs: parts.attributs(),
            prodiges:  parts.prodiges(),
        }

		return data;
	}

	_initialize(options = {}) {
		super._initialize(options);
	}

    get actor() {
        return this.parent;
    }

    prepareBaseData() {
      this._setEndurance();
    }

    prepareDerivedData() {
      const physique = parseInt(this.attributs.physique.value);
      const agilite = parseInt(this.attributs.physique.competences.agilite.value);
      const melee = parseInt(this.attributs.physique.competences.melee.value);
      const armeDistance = parseInt(this.attributs.physique.competences.armesDistance.value);
      const wpnContact = parseInt(this.combat.bonus.contact);
      const wpnDistance = parseInt(this.combat.bonus.distance);
      const armorBonus = parseInt(this.reserves.bonus.armure);

      Object.defineProperty(this.combat, 'mainsNues', {
        value: physique+agilite+melee+armorBonus,
        writable:true,
        enumerable:true,
        configurable:true
      });

      Object.defineProperty(this.combat, 'auContact', {
        value: physique+agilite+melee+wpnContact,
        writable:true,
        enumerable:true,
        configurable:true
      });

      Object.defineProperty(this.combat, 'aDistance', {
        value: physique+armeDistance+wpnDistance,
        writable:true,
        enumerable:true,
        configurable:true
      });
    }

    _setEndurance() {
        const physique = parseInt(this.attributs.physique.value);
        const modEnd = parseInt(this.endurance.modificateur);
        const corruption = parseInt(this.corruption.value);
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

        Object.defineProperty(this.endurance, 'value', {
            value: totalEnd,
            writable:true,
            enumerable:true,
            configurable:true
        });

        Object.defineProperty(this.corruption, 'malus', {
            value: malus,
            writable:true,
            enumerable:true,
            configurable:true
        });
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}