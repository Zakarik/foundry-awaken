export default class Actors_Models {
    static SchemaField = foundry.data.fields.SchemaField;
    static BooleanField = foundry.data.fields.BooleanField;
    static NumberField = foundry.data.fields.NumberField;
    static StringField = foundry.data.fields.StringField;
    static HtmlField = foundry.data.fields.HTMLField;

    constructor() {}

    armement() {
        return new Actors_Models.SchemaField({
            description:new Actors_Models.HtmlField({initial:""}),
            nom:new Actors_Models.StringField({initial:""}),
            type:new Actors_Models.StringField({initial:""}),
            typeDegats:new Actors_Models.StringField({initial:""}),
            dgts:new Actors_Models.NumberField({initial:0})
        })
    }

    armure() {
        return new Actors_Models.SchemaField({
            malus:new Actors_Models.SchemaField({
                physique:new Actors_Models.NumberField({initial:0})
            }),
        })
    }

    combat() {
        return new Actors_Models.SchemaField({
            aDistance:new Actors_Models.NumberField({initial:0}),
            auContact:new Actors_Models.NumberField({initial:0}),
            mainsNues:new Actors_Models.NumberField({initial:0}),
            bonus:new Actors_Models.SchemaField({
                contact:new Actors_Models.NumberField({initial:0}),
                distance:new Actors_Models.NumberField({initial:0}),
            })
        })
    }

    corruption() {
        let data = {
            value: new Actors_Models.NumberField({ initial: 0 }),
            malus: new Actors_Models.NumberField({ initial: 0 }),
            check:new Actors_Models.SchemaField(this._generateCorruptionCheck()),
        }

        return new Actors_Models.SchemaField(data);
    }

    vitalite() {
        return new Actors_Models.SchemaField({
            value: new Actors_Models.NumberField({ initial: 0 }),
            subValue: new Actors_Models.NumberField({ initial: 2 }),
            liste: new Actors_Models.SchemaField({
                formeOlympique:new Actors_Models.SchemaField(this._generateVitalite(7, 10)),
                normal: new Actors_Models.SchemaField(this._generateVitalite(4, 6)),
                blesse: new Actors_Models.SchemaField(this._generateVitalite(2, 3)),
                grievementBlesse: new Actors_Models.SchemaField(this._generateVitalite(0, 1)),
                mourant:new Actors_Models.SchemaField({
                    v1:new Actors_Models.BooleanField({ initial: false }),
                    v2:new Actors_Models.BooleanField({ initial: false }),
                    v3:new Actors_Models.BooleanField({ initial: false }),
                    v4:new Actors_Models.BooleanField({ initial: false }),
                }),
            })
        });
    }

    endurance() {
        return new Actors_Models.SchemaField({
            modificateur: new Actors_Models.NumberField({ initial: 0 }),
            value: new Actors_Models.NumberField({ initial: 0 }),
        });
    }

    reserves() {
        return new Actors_Models.SchemaField({
            modificateur: new Actors_Models.NumberField({ initial: 0 }),
            total: new Actors_Models.NumberField({ initial: 0 }),
            bonus: new Actors_Models.SchemaField({
                armure:new Actors_Models.NumberField({initial:1})
            }),
            attaque:this._generateValueWithMin(0, 0),
            defense:this._generateValueWithMin(0, 0),
        });
    }

    vertus() {
        return new Actors_Models.SchemaField({
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
            cmp['social'][c] = new Actors_Models.SchemaField({
                value:new Actors_Models.NumberField({ initial: 0 }),
                min:new Actors_Models.NumberField({ initial: 0 }),
                experience:new Actors_Models.SchemaField({
                    c1:new Actors_Models.BooleanField({ initial: false }),
                    c2:new Actors_Models.BooleanField({ initial: false }),
                    c3:new Actors_Models.BooleanField({ initial: false }),
                    c4:new Actors_Models.BooleanField({ initial: false }),
                    c5:new Actors_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let c of ATTRS['mental'].competences) {
            cmp['mental'][c] = new Actors_Models.SchemaField({
                value:new Actors_Models.NumberField({ initial: 0 }),
                min:new Actors_Models.NumberField({ initial: 0 }),
                experience:new Actors_Models.SchemaField({
                    c1:new Actors_Models.BooleanField({ initial: false }),
                    c2:new Actors_Models.BooleanField({ initial: false }),
                    c3:new Actors_Models.BooleanField({ initial: false }),
                    c4:new Actors_Models.BooleanField({ initial: false }),
                    c5:new Actors_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let c of ATTRS['physique'].competences) {
            cmp['physique'][c] = new Actors_Models.SchemaField({
                value:new Actors_Models.NumberField({ initial: 0 }),
                min:new Actors_Models.NumberField({ initial: 0 }),
                experience:new Actors_Models.SchemaField({
                    c1:new Actors_Models.BooleanField({ initial: false }),
                    c2:new Actors_Models.BooleanField({ initial: false }),
                    c3:new Actors_Models.BooleanField({ initial: false }),
                    c4:new Actors_Models.BooleanField({ initial: false }),
                    c5:new Actors_Models.BooleanField({ initial: false }),
                }),
            });
        }

        for(let a in ATTRS) {
            data[a] = new Actors_Models.SchemaField({
                value:new Actors_Models.NumberField({ initial: 1 }),
                min:new Actors_Models.NumberField({ initial: 1 }),
                first:new Actors_Models.BooleanField({ initial: ATTRS[a]?.first ?? false }),
                malus:new Actors_Models.BooleanField({ initial: ATTRS[a]?.malus ?? false }),
                competences:new Actors_Models.SchemaField(cmp[a]),
            });
        }

        return new Actors_Models.SchemaField(data);
    }

    prodiges() {
        const prodige = CONFIG.AWAKEN.ListProdiges;
        let data = {};

        for(let p of prodige) {
            data[p] = new Actors_Models.SchemaField({
                value:new Actors_Models.NumberField({ initial: 0 }),
                min:new Actors_Models.NumberField({ initial: 0 }),
                experience:new Actors_Models.SchemaField({
                    c1:new Actors_Models.BooleanField({ initial: false }),
                    c2:new Actors_Models.BooleanField({ initial: false }),
                    c3:new Actors_Models.BooleanField({ initial: false }),
                    c4:new Actors_Models.BooleanField({ initial: false }),
                    c5:new Actors_Models.BooleanField({ initial: false })
                }),
            });
        }

        return new Actors_Models.SchemaField(data);
    }

    _generateCorruptionCheck(min, max) {
        let data = {};

        for(let i = min;i <= max;i++) {
            data[`c${i}`] = new Actors_Models.BooleanField({ initial: false });
        }

        return data;
    }

    _generateVitalite(min, max) {
        let data = {};

        for(let i = min;i <= max;i++) {
            data[`v${i}`] = new Actors_Models.SchemaField({
                label: new Actors_Models.NumberField({ initial: i }),
            });
        }

        return data;
    }

    _generateValueWithMin(value, min) {
        return new Actors_Models.SchemaField({
            value: new Actors_Models.NumberField({ initial: value }),
            min: new Actors_Models.NumberField({ initial: min }),
        });
    }

    _generateLargeVertus(value, min, max, depenseMin, depenseMax, showed=[]) {
        let depense = {};

        for(let i = depenseMin;i <= depenseMax;i++) {
            depense[`b${i}`] = new Actors_Models.SchemaField({
                label: new Actors_Models.NumberField({ initial: i }),
                show:new Actors_Models.BooleanField({ initial: showed.includes(i) }),
                used:new Actors_Models.BooleanField({ initial: false }),
            });
        }

        return new Actors_Models.SchemaField({
            value:new Actors_Models.NumberField({ initial: value }),
            min:new Actors_Models.NumberField({ initial: min}),
            max:new Actors_Models.NumberField({ initial: max }),
            depense:new Actors_Models.SchemaField(depense),
        })
    }

    _generateSmallVertus(value, min, max) {
        return new Actors_Models.SchemaField({
            value:new Actors_Models.NumberField({ initial: value }),
            min:new Actors_Models.NumberField({ initial: min}),
            max:new Actors_Models.NumberField({ initial: max }),
        })
    }
}
