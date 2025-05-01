export class Actors_Models {
    static SchemaField = foundry.data.fields.SchemaField;
    static BooleanField = foundry.data.fields.BooleanField;
    static NumberField = foundry.data.fields.NumberField;
    static StringField = foundry.data.fields.StringField;
    static HtmlField = foundry.data.fields.HtmlField;

    constructor() {}

    armement() {
        return new Parts_Models.SchemaField({
            description:new Parts_Models.HtmlField({initial:""}),
            nom:new Parts_Models.StringField({initial:""}),
            type:new Parts_Models.StringField({initial:""}),
            typeDegats:new Parts_Models.StringField({initial:""}),
            dgts:new Parts_Models.BooleanField({initial:0})
        })
    }

    armure() {
        return new Parts_Models.SchemaField({
            malus:new Parts_Models.SchemaField({
                physique:new Parts_Models.BooleanField({initial:0})
            }),
        })
    }

    combat() {
        return new Parts_Models.SchemaField({
            aDistance:new Parts_Models.NumberField({initial:0}),
            auContact:new Parts_Models.NumberField({initial:0}),
            mainsNues:new Parts_Models.NumberField({initial:0}),
        })
    }

    corruption() {
        let data = {
            value: new Parts_Models.NumberField({ initial: 0 }),
            malus: new Parts_Models.NumberField({ initial: 0 }),
            check:new Parts_Models.SchemaField(this._generateCorruptionCheck()),
        }

        return new Parts_Models.SchemaField(data);
    }

    vitalite() {
        return new Parts_Models.SchemaField({
            value: new Parts_Models.NumberField({ initial: 0 }),
            subValue: new Parts_Models.NumberField({ initial: 2 }),
            liste: new Parts_Models.SchemaField({
                formeOlympique:new Parts_Models.SchemaField(this._generateVitalite(7, 10)),
                normal: new Parts_Models.SchemaField(this._generateVitalite(4, 6)),
                blesse: new Parts_Models.SchemaField(this._generateVitalite(2, 3)),
                grievementBlesse: new Parts_Models.SchemaField(this._generateVitalite(0, 1)),
                mourant:new Parts_Models.SchemaField({
                    v1:new Parts_Models.BooleanField({ initial: false }),
                    v2:new Parts_Models.BooleanField({ initial: false }),
                    v3:new Parts_Models.BooleanField({ initial: false }),
                    v4:new Parts_Models.BooleanField({ initial: false }),
                }),
            })
        });
    }

    endurance() {
        return new Parts_Models.SchemaField({
            modificateur: new Parts_Models.NumberField({ initial: 0 }),
            value: new Parts_Models.NumberField({ initial: 0 }),
        });
    }

    reserves() {
        return new Parts_Models.SchemaField({
            modificateur: new Parts_Models.NumberField({ initial: 0 }),
            total: new Parts_Models.NumberField({ initial: 0 }),
            bonus: new Parts_Models.SchemaField({
                armure:new Parts_Models.NumberField({initial:1})
            }),
            attaque:this._generateValueWithMin(0, 0),
            defense:this._generateValueWithMin(0, 0),
        });
    }

    vertus() {
        return new Parts_Models.SchemaField({
            chance:this._generateLargeVertus(1, 1, 5, 0, 5, [0, 1]),
            courage:this._generateSmallVertus(1, 1, 5),
            volonte:this._generateLargeVertus(1, 1, 5, 0, 5, [0, 1]),
        });
    }

    attributs() {
        const ATTRS = CONFIG.AWAKEN.ListAttributs;
        let data = {};
        let cmp = {
            social:{},
            mental:{},
            physique:{},
        }

        for(let c of ATTRS['social'].competences) {
            cmp['social'][c] = new Parts_Models.SchemaField({
                value:new Parts_Models.NumberField({ initial: 0 }),
                min:new Parts_Models.NumberField({ initial: 0 }),
                experience:new Parts_Models.SchemaField({
                    c1:new Parts_Models.BooleanField({ initial: false }),
                    c2:new Parts_Models.BooleanField({ initial: false }),
                    c3:new Parts_Models.BooleanField({ initial: false }),
                    c4:new Parts_Models.BooleanField({ initial: false }),
                    c5:new Parts_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let c of ATTRS['mental'].competences) {
            cmp['mental'][c] = new Parts_Models.SchemaField({
                value:new Parts_Models.NumberField({ initial: 0 }),
                min:new Parts_Models.NumberField({ initial: 0 }),
                experience:new Parts_Models.SchemaField({
                    c1:new Parts_Models.BooleanField({ initial: false }),
                    c2:new Parts_Models.BooleanField({ initial: false }),
                    c3:new Parts_Models.BooleanField({ initial: false }),
                    c4:new Parts_Models.BooleanField({ initial: false }),
                    c5:new Parts_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let c of ATTRS['physique'].competences) {
            cmp['physique'][c] = new Parts_Models.SchemaField({
                value:new Parts_Models.NumberField({ initial: 0 }),
                min:new Parts_Models.NumberField({ initial: 0 }),
                experience:new Parts_Models.SchemaField({
                    c1:new Parts_Models.BooleanField({ initial: false }),
                    c2:new Parts_Models.BooleanField({ initial: false }),
                    c3:new Parts_Models.BooleanField({ initial: false }),
                    c4:new Parts_Models.BooleanField({ initial: false }),
                    c5:new Parts_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let a in ATTRS) {
            data[a] = new Parts_Models.SchemaField({
                value:new Parts_Models.NumberField({ initial: 1 }),
                min:new Parts_Models.NumberField({ initial: 1 }),
                first:new Parts_Models.BooleanField({ initial: ATTRS[a]?.first ?? false }),
                malus:new Parts_Models.BooleanField({ initial: ATTRS[a]?.malus ?? false }),
                competences:new Parts_Models.SchemaField(cmp[a]),
            });
        }

        return new Parts_Models.SchemaField(data);
    }

    prodiges() {
        const prodige = CONFIG.AWAKEN.ListProdiges;
        let data = {};

        for(let p of prodige) {
            data[p] = new Parts_Models.SchemaField({
                value:new Parts_Models.NumberField({ initial: 0 }),
                min:new Parts_Models.NumberField({ initial: 0 }),
                experience:new Parts_Models.SchemaField({
                    c1:new Parts_Models.BooleanField({ initial: false }),
                    c2:new Parts_Models.BooleanField({ initial: false }),
                    c3:new Parts_Models.BooleanField({ initial: false }),
                    c4:new Parts_Models.BooleanField({ initial: false }),
                    c5:new Parts_Models.BooleanField({ initial: false })
                }),
            });
        }

        return new Parts_Models.SchemaField(data);
    }

    _generateCorruptionCheck(min, max) {
        let data = {};

        for(let i = min;i <= max;i++) {
            data[`c${i}`] = new Parts_Models.BooleanField({ initial: false });
        }

        return data;
    }

    _generateVitalite(min, max) {
        let data = {};

        for(let i = min;i <= max;i++) {
            data[`v${i}`] = new Parts_Models.SchemaField({
                label: new Parts_Models.NumberField({ initial: i }),
            });
        }

        return data;
    }

    _generateValueWithMin(value, min) {
        return new Parts_Models.SchemaField({
            value: new Parts_Models.NumberField({ initial: value }),
            min: new Parts_Models.NumberField({ initial: min }),
        });
    }

    _generateLargeVertus(value, min, max, depenseMin, depenseMax, showed=[]) {
        let depense = {};

        for(let i = depenseMin;i <= depenseMax;i++) {
            depense[`b${i}`] = new Parts_Models.SchemaField({
                label: new Parts_Models.NumberField({ initial: i }),
                show:new Parts_Models.BooleanField({ initial: showed.includes(i) }),
                used:new Parts_Models.BooleanField({ initial: false }),
            });
        }

        return new Parts_Models.SchemaField({
            value:new Parts_Models.NumberField({ initial: value }),
            min:new Parts_Models.NumberField({ initial: min}),
            max:new Parts_Models.NumberField({ initial: max }),
            depense:depense
        })
    }

    _generateSmallVertus(value, min, max) {
        return new Parts_Models.SchemaField({
            value:new Parts_Models.NumberField({ initial: value }),
            min:new Parts_Models.NumberField({ initial: min}),
            max:new Parts_Models.NumberField({ initial: max }),
        })
    }
}