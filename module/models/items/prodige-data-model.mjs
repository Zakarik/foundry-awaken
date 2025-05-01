export class ProdigeDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, NumberField, HTMLField} = foundry.data.fields;
        let data = {
            description: new HTMLField({initial:""}),
            famille: new StringField({initial:"esprit"}),
            rang:new NumberField({initial:1}),
            type:new StringField({initial:"instinctif"}),
            labelType:new StringField({initial:""}),
            activation:new StringField({initial:""}),
            duree:new StringField({initial:""}),
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