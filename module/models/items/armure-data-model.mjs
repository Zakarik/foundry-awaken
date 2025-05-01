export class ArmureDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {NumberField, BooleanField, HTMLField} = foundry.data.fields;
        let data = {
            description: new HTMLField({initial:""}),
            malusPhysique:new NumberField({initial:0}),
            bonusDefense:new NumberField({initial:0}),
            bonusContact:new NumberField({initial:0}),
            wear:new BooleanField({initial:false}),
        }

		return data;
	}

	_initialize(options = {}) {
		super._initialize(options);
	}

    get item() {
        return this.parent;
    }

    prepareBaseData() {
    }

    prepareDerivedData() {
    }

    static migrateData(source) {
        return super.migrateData(source);
    }
}