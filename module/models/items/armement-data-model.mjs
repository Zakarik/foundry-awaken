export class ArmementDataModel extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		const {StringField, NumberField, BooleanField, HTMLField} = foundry.data.fields;
        let data = {
            description:  new HTMLField({initial:""}),
            type: new StringField({initial:"contact"}),
            labelType: new StringField({initial:""}),
            degats: new NumberField({initial:0}),
            typeDegats: new StringField({initial:"superficiels"}),
            labelTypeDegats: new StringField({initial:""}),
            wear: new BooleanField({initial:false}),
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