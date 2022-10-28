/**
 * @extends {ActorSheet}
 */
export class AwakenActorSheet extends ActorSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["awaken", "sheet", "actor"],
      template: "systems/awaken/templates/actor-sheet.html",
      width: 900,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      dragDrop: [{dragSelector: ".draggable", dropSelector: null}],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    for (let [key, attr] of Object.entries(context.data.system.attributs)){
      attr.label = game.i18n.localize(CONFIG.AWAKEN.attributs[key]);

      for (let [keyComp, comp] of Object.entries(attr.competences)){
        comp.label = game.i18n.localize(CONFIG.AWAKEN.competences[keyComp]);
      }
    }

    for (let [key, attr] of Object.entries(context.data.system.prodiges)){
      attr.label = game.i18n.localize(CONFIG.AWAKEN.prodiges[key]);
    }

    this._prepareCharacterItems(context);
    this._prepareCharacterReserves(context);

    context.systemData = context.data.system;

    this._setCorruption(context);
    this._setVitalite(context);

    return context;
  }

  /**
     * Return a light sheet if in "limited" state
     * @override
     */
   get template() {
    if (!game.user.isGM && this.actor.limited) {
      return "systems/awaken/templates/limited-sheet.html";
    }
    return this.options.template;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;

    html.find('.item-create').click(this._onItemCreate.bind(this));

    html.find('.item-edit').click(ev => {
      const header = $(ev.currentTarget).parents(".rItems");
      const item = this.actor.items.get(header.data("item-id"));
      item.sheet.render(true);
    });

    html.find('.item-delete').click(ev => {
      const header = $(ev.currentTarget).parents(".rItems");
      const item = this.actor.items.get(header.data("item-id"));
      item.delete();
      header.slideUp(200, () => this.render(false));
    });

    html.find('.unchecked').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const number = +$(ev.currentTarget).data("number");

      let data;

      if(type === "competence") {
        const attribut = $(ev.currentTarget).data("attribut");
        const competence = $(ev.currentTarget).data("competence");

        switch(number) {
          case 1:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:true
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 2:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:true,
                          c2:true
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 3:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:true,
                          c2:true,
                          c3:true
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 4:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:true,
                          c2:true,
                          c3:true,
                          c4:true
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 5:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:true,
                          c2:true,
                          c3:true,
                          c4:true,
                          c5:true
                        }
                      }
                    }
                  }
                }
              }
            }
            break;
        }
      } else if(type === "prodige") {
        const prodige = $(ev.currentTarget).data("prodiges");

        switch(number) {
          case 1:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:true
                    }
                  }
                }
              }
            }
            break;

          case 2:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:true,
                      c2:true
                    }
                  }
                }
              }
            }
            break;

          case 3:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:true,
                      c2:true,
                      c3:true
                    }
                  }
                }
              }
            }
            break;

          case 4:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:true,
                      c2:true,
                      c3:true,
                      c4:true
                    }
                  }
                }
              }
            }
            break;

          case 5:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:true,
                      c2:true,
                      c3:true,
                      c4:true,
                      c5:true
                    }
                  }
                }
              }
            }
            break;
        }
      }

      this.actor.update(data);
    });

    html.find('.checked').click(ev => {
      const type = $(ev.currentTarget).data("type");
      const number = +$(ev.currentTarget).data("number");

      let data;

      if(type === "competence") {
        const attribut = $(ev.currentTarget).data("attribut");
        const competence = $(ev.currentTarget).data("competence");

        switch(number) {
          case 1:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c1:false,
                          c2:false,
                          c3:false,
                          c4:false,
                          c5:false
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 2:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c2:false,
                          c3:false,
                          c4:false,
                          c5:false
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 3:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c3:false,
                          c4:false,
                          c5:false
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 4:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c4:false,
                          c5:false
                        }
                      }
                    }
                  }
                }
              }
            }
            break;

          case 5:
            data = {
              system:{
                attributs:{
                  [attribut]:{
                    competences:{
                      [competence]:{
                        experience:{
                          c5:false
                        }
                      }
                    }
                  }
                }
              }
            }
            break;
        }
      } else if(type === "prodige") {
        const prodige = $(ev.currentTarget).data("prodiges");

        switch(number) {
          case 1:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c1:false,
                      c2:false,
                      c3:false,
                      c4:false,
                      c5:false
                    }
                  }
                }
              }
            }
            break;

          case 2:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c2:false,
                      c3:false,
                      c4:false,
                      c5:false
                    }
                  }
                }
              }
            }
            break;

          case 3:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c3:false,
                      c4:false,
                      c5:false
                    }
                  }
                }
              }
            }
            break;

          case 4:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                      experience:{
                        c4:false,
                        c5:false
                      }
                  }
                }
              }
            }
            break;

          case 5:
            data = {
              system:{
                prodiges:{
                  [prodige]:{
                    experience:{
                      c5:false
                    }
                  }
                }
              }
            }
            break;
        }
      }

      this.actor.update(data);
    });

    html.find('input.physique').change(ev => {
      const vitalite = +this.getData().data.system.vitalite.value;
      const endurance = +$(ev.currentTarget).val()+3;

      if(endurance < vitalite) {
        let adjust = endurance;

        const update = {
          system:{
            vitalite: {
              value: adjust,
              subValue: 2
            }
          }
        };

        this.actor.update(update);
      }
    });

    html.find('button.endurance').click(ev => {
      const score = +this.getData().data.system.corruption.value;
      let nScore = +$(ev.currentTarget).data("number");

      if(score === nScore) { nScore = 0; }

      const update = {
        system:{
          corruption:{
            value:nScore
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.endurance div.line button').click(ev => {
      const valueEndurance = this.getData().data.system.endurance.value;

      let num = +$(ev.currentTarget).data("num");
      let sub = +$(ev.currentTarget).data("sub");

      if (num === valueEndurance) { sub = 2; }

      const update = {
        system:{
          vitalite:{
            value: num,
            subValue: sub
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.endurance div.lastLine button').click(ev => {
      let num = +$(ev.currentTarget).data("num");
      let sub = 0;

      const update = {
        system:{
          vitalite:{
            value: num,
            subValue: sub
          }
        }
      };

      this.actor.update(update);
    });

    html.find('input.vertusValue').change(ev => {
      const type = $(ev.currentTarget).data("type");
      const value = +$(ev.currentTarget).val();

      let b2 = false;
      let b3 = false;
      let b4 = false;
      let b5 = false;

      switch(value) {
        case 2:
          b2 = true;
          break;

        case 3:
          b2 = true;
          b3 = true;
          break;

        case 4:
          b2 = true;
          b3 = true;
          b4 = true;
          break;

        case 5:
          b2 = true;
          b3 = true;
          b4 = true;
          b5 = true;
          break;
      }

      const update = {
        system:{
          vertus:{
            [type]:{
              depense:{
                b2:{
                  show:b2
                },
                b3:{
                  show:b3
                },
                b4:{
                  show:b4
                },
                b5:{
                  show:b5
                },
              }
            }
          }
        }
      };

      this.actor.update(update);
    });

    html.find('.vertus button').click(ev => {
      const type = $(ev.currentTarget).data("type");
      let number = +$(ev.currentTarget).data("number");

      if(number === 0) { number = 1; }

      const value = this.getData().data.system.vertus[type].depense["b"+number].used;

      let b1 = false;
      let b2 = false;
      let b3 = false;
      let b4 = false;
      let b5 = false;

      if(value != true) {
        switch(number) {
          case 0:
          case 1:
            b1 = true;
            b2 = true;
            b3 = true;
            b4 = true;
            b5 = true;
            break;

          case 2:
            b2 = true;
            b3 = true;
            b4 = true;
            b5 = true;
            break;

          case 3:
            b3 = true;
            b4 = true;
            b5 = true;
            break;

          case 4:
            b4 = true;
            b5 = true;
            break;

          case 5:
            b5 = true;
            break;
        }
      }

      const update = {
        system:{
          vertus:{
            [type]:{
              depense:{
                b1:{
                  used:b1
                },
                b2:{
                  used:b2
                },
                b3:{
                  used:b3
                },
                b4:{
                  used:b4
                },
                b5:{
                  used:b5
                },
              }
            }
          }
        }
      };

      this.actor.update(update);
    });

    html.find('div.expand i.buttonExpand').click(ev => {
      $(ev.currentTarget).toggleClass("fa-plus-square fa-minus-square");
      $(ev.currentTarget).parents("div.expand").children(".options").toggleClass("show hide");
    });

    html.find('img.wear').click(ev => {
      const header = $(ev.currentTarget).parents(".rItems");
      const item = this.actor.items.get(header.data("item-id"));
      const type = item.type;
      const wpnType = item.system.type;
      const wpnListStats = this._getWpnStats();

      const update = {
        system: {
            wear:true
        }
      };

      if(type === "armure") {
        item.update(update);
      } else {
        if(wpnType === "contact" && wpnListStats.contact < 2 && wpnListStats.distance === 0) {

          item.update(update);
        } else if(wpnType === "distance" && wpnListStats.distance === 0 && wpnListStats.contact === 0) {

          item.update(update);
        }
      }
    });

    html.find('img.unwear').click(ev => {
      const header = $(ev.currentTarget).parents(".rItems");
      const item = this.actor.items.get(header.data("item-id"));

      const update = {
        system: {
              wear:false
          }
      };

      item.update(update);
    });

    html.find('input.reserveAttaque').change(ev => {
      const value = +$(ev.currentTarget).val();
      const rTotal = +this.getData().data.system.reserves.total;
      const rDefense = +this.getData().data.system.reserves.defense.value;
      const rDefenseMin = +this.getData().data.system.reserves.defense.min;

      const total = value+rDefense;

      if(total > rTotal) {
        if(rDefense != rDefenseMin) {
          let update = {
            system:{
              reserves:{
                defense:{
                  value:rDefense-1
                }
              }
            }
          };

          this.actor.update(update);
        } else if(rDefense === rDefenseMin) {
          $(ev.currentTarget).val(rTotal-rDefense);
        }
      }
    });

    html.find('input.reserveDefense').change(ev => {
      const value = +$(ev.currentTarget).val();
      const rTotal = +this.getData().data.system.reserves.total;
      const rAttaque = +this.getData().data.system.reserves.attaque.value;
      const rAttaqueMin = +this.getData().data.system.reserves.attaque.min;

      const total = value+rAttaque;

      if(total > rTotal) {
        if(rAttaque != rAttaqueMin) {
          let update = {
            system:{
              reserves:{
                attaque:{
                  value:rAttaque-1
                }
              }
            }
          };

          this.actor.update(update);
        } else if(rAttaque === rAttaqueMin) {
          $(ev.currentTarget).val(rTotal-rAttaque);
        }
      }
    });

    html.find('img.roll').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6Black.svg");
    });

    html.find('img.rollCombat').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6Black.svg");
    });

    html.find('img.rollVertus').hover(ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6White.svg");
    }, ev => {
      $(ev.currentTarget).attr("src", "systems/awaken/assets/icons/D6Black.svg");
    });

    html.find('.roll').click(this._onRoll.bind(this));
    html.find('.rollCombat').click(this._onRollCombat.bind(this));
    html.find('.rollVertus').click(this._onRollVertus.bind(this));
  }

  _onDragStart(event) {
    const li = event.currentTarget;
    const hasRoll = $(li).hasClass("roll");
    const hasRollVertus = $(li).hasClass("rollVertus");

    if ( event.target.classList.contains("content-link") ) return;

    // Create drag data
    const dragData = {
      actorId: this.actor.id,
      sceneId: this.actor.isToken ? canvas.scene?.id : null,
      tokenId: this.actor.isToken ? this.actor.token.id : null,
      label:$(li).data("label")
    };

    if(hasRoll || hasRollVertus) {
      dragData.type = $(li).data("macrotype");
      dragData.attr = $(li).data("macroattr");
      dragData.comp = $(li).data("macrocomp") || "";
      dragData.itemId = $(li).data("macroitem") || 0;
    }

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /* -------------------------------------------- */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `${game.i18n.localize(`ITEM.Type${type.capitalize()}`)}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };

    switch(type) {
      case "equipement":
          itemData.img = "systems/awaken/assets/icons/equipement.svg";
          break;

      case "armement":
          itemData.img = "systems/awaken/assets/icons/armement.svg";
          break;

      case "armure":
          itemData.img = "systems/awaken/assets/icons/armure.svg";
          break;

      case "prodige":
          itemData.img = "systems/awaken/assets/icons/prodige.svg";
          break;

      case "specialisation":
          itemData.img = "systems/awaken/assets/icons/specialisation.svg";
          break;

      case "reputation":
          itemData.img = "systems/awaken/assets/icons/reputation.svg";
          break;
    }

    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system["type"];

    // Finally, create the item!
    return await Item.create(itemData, {parent: this.actor});
  }

  _setCorruption(context) {
    context.systemData.corruption.check = {};

    switch(context.data.system.corruption.value) {
      case 1:
        context.systemData.corruption.check.c1 = true;
        break;

      case 2:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        break;

      case 3:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        break;

      case 4:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        break;

      case 5:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        break;

      case 6:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        break;

      case 7:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        break;

      case 8:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        break;

      case 9:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        break;

      case 10:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        break;

      case 11:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        context.systemData.corruption.check.c11 = true;
        break;

      case 12:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        context.systemData.corruption.check.c11 = true;
        context.systemData.corruption.check.c12 = true;
        break;

      case 13:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        context.systemData.corruption.check.c11 = true;
        context.systemData.corruption.check.c12 = true;
        context.systemData.corruption.check.c13 = true;
        break;

      case 14:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        context.systemData.corruption.check.c11 = true;
        context.systemData.corruption.check.c12 = true;
        context.systemData.corruption.check.c13 = true;
        context.systemData.corruption.check.c14 = true;
        break;

      case 15:
        context.systemData.corruption.check.c1 = true;
        context.systemData.corruption.check.c2 = true;
        context.systemData.corruption.check.c3 = true;
        context.systemData.corruption.check.c4 = true;
        context.systemData.corruption.check.c5 = true;
        context.systemData.corruption.check.c6 = true;
        context.systemData.corruption.check.c7 = true;
        context.systemData.corruption.check.c8 = true;
        context.systemData.corruption.check.c9 = true;
        context.systemData.corruption.check.c10 = true;
        context.systemData.corruption.check.c11 = true;
        context.systemData.corruption.check.c12 = true;
        context.systemData.corruption.check.c13 = true;
        context.systemData.corruption.check.c14 = true;
        context.systemData.corruption.check.c15 = true;
        break;
    }
  }

  _setVitalite(context) {
    const dataVitalite = context.systemData.vitalite;
    let valueEndurance = +context.systemData.endurance.value;

    if (valueEndurance > 10) { valueEndurance = 10; }

    for (let i = -4;i <= valueEndurance;i++) {
      switch(i) {
        case 10:
        case 9:
        case 8:
        case 7:
            dataVitalite.liste.formeOlympique["v"+i].active = true;

            if (dataVitalite.value < i) {
              dataVitalite.liste.formeOlympique["v"+i].s1Checked = true;
              dataVitalite.liste.formeOlympique["v"+i].s2Checked = true;
            } else if(dataVitalite.value === i) {
              if(dataVitalite.subValue === 2) {
                dataVitalite.liste.formeOlympique["v"+i].s1Checked = true;
                dataVitalite.liste.formeOlympique["v"+i].s2Checked = true;
              } else if(dataVitalite.subValue === 1) {
                dataVitalite.liste.formeOlympique["v"+i].s1Checked = true;
              }
            }
          break;

        case 6:
        case 5:
        case 4:
            dataVitalite.liste.normal["v"+i].active = true;

            if (dataVitalite.value < i) {
              dataVitalite.liste.normal["v"+i].s1Checked = true;
              dataVitalite.liste.normal["v"+i].s2Checked = true;
            } else if(dataVitalite.value === i) {
              if(dataVitalite.subValue === 2) {
                dataVitalite.liste.normal["v"+i].s1Checked = true;
                dataVitalite.liste.normal["v"+i].s2Checked = true;
              } else if(dataVitalite.subValue === 1) {
                dataVitalite.liste.normal["v"+i].s1Checked = true;
              }
            }
          break;

        case 3:
        case 2:
          dataVitalite.liste.blesse["v"+i].active = true;

          if (dataVitalite.value < i) {
            dataVitalite.liste.blesse["v"+i].s1Checked = true;
            dataVitalite.liste.blesse["v"+i].s2Checked = true;
          } else if(dataVitalite.value === i) {
            if(dataVitalite.subValue === 2) {
              dataVitalite.liste.blesse["v"+i].s1Checked = true;
              dataVitalite.liste.blesse["v"+i].s2Checked = true;
            } else if(dataVitalite.subValue === 1) {
              dataVitalite.liste.blesse["v"+i].s1Checked = true;
            }
          }
          break;

        case 1:
        case 0:
          dataVitalite.liste.grievementBlesse["v"+i].active = true;

          if (dataVitalite.value < i) {
            dataVitalite.liste.grievementBlesse["v"+i].s1Checked = true;
            dataVitalite.liste.grievementBlesse["v"+i].s2Checked = true;
          } else if(dataVitalite.value === i) {
            if(dataVitalite.subValue === 2) {
              dataVitalite.liste.grievementBlesse["v"+i].s1Checked = true;
              dataVitalite.liste.grievementBlesse["v"+i].s2Checked = true;
            } else if(dataVitalite.subValue === 1) {
              dataVitalite.liste.grievementBlesse["v"+i].s1Checked = true;
            }
          }
          break;

        case -1:
          if(dataVitalite.value === i) {
            dataVitalite.liste.mourant["v1"] = true;
          }
          break;

        case -2:
          if(dataVitalite.value === i) {
            dataVitalite.liste.mourant["v1"] = true;
            dataVitalite.liste.mourant["v2"] = true;
          }
          break;

        case -3:
          if(dataVitalite.value === i) {
            dataVitalite.liste.mourant["v1"] = true;
            dataVitalite.liste.mourant["v2"] = true;
            dataVitalite.liste.mourant["v3"] = true;
          }
          break;

        case -4:
          if(dataVitalite.value === i) {
            dataVitalite.liste.mourant["v1"] = true;
            dataVitalite.liste.mourant["v2"] = true;
            dataVitalite.liste.mourant["v3"] = true;
            dataVitalite.liste.mourant["v4"] = true;
          }
          break;
      }
    }
  }

  _prepareCharacterItems(sheetData) {
    const actorData = sheetData.actor;
    const compData = sheetData.data.system.attributs;
    const prodigeData = sheetData.data.system.prodiges;

    const equipement = [];
    const reputation = [];

    const expression = [];
    const empathie = [];
    const rhetorique = [];
    const representation = [];
    const negoce = [];

    const erudition = [];
    const artisanat = [];
    const medecine = [];
    const savoir = [];
    const perception = [];

    const agilite = [];
    const melee = [];
    const discretion = [];
    const armesDistance = [];
    const survie = [];

    const esprit = [];
    const corps = [];
    const illusion = [];
    const realite = [];

    let contact = 0;
    let distance = 0;
    let bonusArmeContact = 0;
    let bonusArmeDistance = 0;
    const armement = {
      equipped:{
        contact:0,
        distance:0,
      },
      wear:[],
      unwear:[]
    };
    const detailArme = {
      nom:"",
      type:"",
      degats:"",
      typeDegats:"",
      description:""
    }

    let bonusArmureDefense = 0;
    let bonusArmureContact = 0;
    let malusArmurePhysique = 0;
    const armure = {
      wear:[],
      unwear:[]
    };

    for (let i of sheetData.items) {
      // EQUIPEMENT.
      if (i.type === 'equipement') {
        equipement.push(i);
      }
      // REPUTATION.
      else if (i.type === 'reputation') {
        reputation.push(i);
      }
      // SPECIALISATION.
      else if (i.type === 'specialisation') {
        const comp = i.system.competence;

        switch(comp) {
          case "expression":
              expression.push(i);
            break;

          case "empathie":
              empathie.push(i);
            break;

          case "rhetorique":
              rhetorique.push(i);
            break;

          case "representation":
              representation.push(i);
            break;

          case "negoce":
              negoce.push(i);
            break;

          case "erudition":
              erudition.push(i);
            break;

          case "artisanat":
              artisanat.push(i);
            break;

          case "medecine":
              medecine.push(i);
            break;

          case "savoir":
              savoir.push(i);
            break;

          case "perception":
              perception.push(i);
            break;

          case "agilite":
              agilite.push(i);
            break;

          case "melee":
              melee.push(i);
            break;

          case "discretion":
              discretion.push(i);
            break;

          case "armesDistance":
              armesDistance.push(i);
            break;

          case "survie":
              survie.push(i);
            break;
        }
      }
      // PRODIGE
      else if (i.type === 'prodige') {
        const famille = i.system.famille;

        if(i.system.labelType === "") {
          i.system.labelType = game.i18n.localize(CONFIG.AWAKEN.prodiges[i.system.type]);
        }

        switch(famille) {
          case "esprit":
            esprit.push(i);
            break;

          case "corps":
            corps.push(i);
            break;

          case "illusion":
            illusion.push(i);
            break;

          case "realite":
            realite.push(i);
            break;
        }
      }
      // ARMEMENT
      else if (i.type === 'armement') {
        const wear = i.system.wear;

        if(i.system.labelType === "") {
          i.system.labelType = game.i18n.localize(CONFIG.AWAKEN.armement[i.system.type]);
        }

        if(i.system.labelTypeDegats === "") {
          i.system.labelTypeDegats = game.i18n.localize(CONFIG.AWAKEN.armement[i.system.typeDegats]);
        }

        if(wear) {
          const dgts = +i.system.degats;
          const name = i.name;
          const type = i.system.labelType;
          const typeDegats = i.system.labelTypeDegats;
          const description = i.system.description;

          if(i.system.type === "contact") {
            contact += 1;
            if(contact === 1) {
              bonusArmeContact += dgts;
              detailArme.nom = name;
              detailArme.type = type;
              detailArme.degats = dgts;
              detailArme.typeDegats = typeDegats;
              detailArme.description = description;
            } else if(contact === 2 && dgts > bonusArmeContact) {
              bonusArmeContact = dgts+1;
              detailArme.nom = detailArme.nom+" / "+name;
              detailArme.type = detailArme.type+" / "+type;
              detailArme.degats = detailArme.degats+" / "+dgts;
              detailArme.typeDegats = detailArme.typeDegats+" / "+typeDegats;
              detailArme.description = detailArme.description+" / "+description;
            } else if(contact === 2 && dgts <= bonusArmeContact) {
              bonusArmeContact += 1;
              detailArme.nom = detailArme.nom+" / "+name;
              detailArme.type = detailArme.type+" / "+type;
              detailArme.degats = detailArme.degats+" / "+dgts;
              detailArme.typeDegats = detailArme.typeDegats+" / "+typeDegats;
              detailArme.description = detailArme.description+" / "+description;
            }
          } else {
            distance += 1;
            bonusArmeDistance += dgts;
          }

          armement.wear.push(i);
        } else {
          armement.unwear.push(i);
        }
      }
      // ARMURE
      else if (i.type === 'armure') {
        const wear = i.system.wear;

        if(wear) {
          armure.wear.push(i);
          bonusArmureContact += i.system.bonusContact;
          bonusArmureDefense += i.system.bonusDefense;
          malusArmurePhysique += i.system.malusPhysique;
        } else {
          armure.unwear.push(i);
        }
      }
    }

    function SortArray(x, y){
      if (x.name < y.name) {return -1;}
      if (x.name > y.name) {return 1;}
      return 0;
    }

    expression.sort(SortArray);
    empathie.sort(SortArray);
    rhetorique.sort(SortArray);
    representation.sort(SortArray);
    negoce.sort(SortArray);

    erudition.sort(SortArray);
    artisanat.sort(SortArray);
    medecine.sort(SortArray);
    savoir.sort(SortArray);
    perception.sort(SortArray);

    agilite.sort(SortArray);
    melee.sort(SortArray);
    discretion.sort(SortArray);
    armesDistance.sort(SortArray);
    survie.sort(SortArray);

    esprit.sort(SortArray);
    corps.sort(SortArray);
    illusion.sort(SortArray);
    realite.sort(SortArray);

    armement.equipped.contact = contact;
    armement.equipped.distance = distance;
    armement.wear.sort(SortArray);
    armement.unwear.sort(SortArray);

    armure.wear.sort(SortArray);
    armure.unwear.sort(SortArray);

    actorData.equipement = equipement;
    actorData.reputation = reputation;
    actorData.armement = armement;
    actorData.armure = armure;

    compData.social.competences.expression.specialisation = expression;
    compData.social.competences.empathie.specialisation = empathie;
    compData.social.competences.rhetorique.specialisation = rhetorique;
    compData.social.competences.representation.specialisation = representation;
    compData.social.competences.negoce.specialisation = negoce;

    compData.mental.competences.erudition.specialisation = erudition;
    compData.mental.competences.artisanat.specialisation = artisanat;
    compData.mental.competences.medecine.specialisation = medecine;
    compData.mental.competences.savoir.specialisation = savoir;
    compData.mental.competences.perception.specialisation = perception;

    compData.physique.competences.agilite.specialisation = agilite;
    compData.physique.competences.melee.specialisation = melee;
    compData.physique.competences.discretion.specialisation = discretion;
    compData.physique.competences.armesDistance.specialisation = armesDistance;
    compData.physique.competences.survie.specialisation = survie;

    prodigeData.esprit.liste = esprit;
    prodigeData.corps.liste = corps;
    prodigeData.illusion.liste = illusion;
    prodigeData.realite.liste = realite;

    sheetData.data.system.armement = {
      nom:detailArme.nom,
      dgts:detailArme.degats,
      type:detailArme.type,
      typeDegats:detailArme.typeDegats,
      description:detailArme.description,
    };

    const bonus = {
      system:{
        combat:{
          bonus:{
            mainsNues:bonusArmeContact+bonusArmureDefense+bonusArmureContact,
            contact:bonusArmeContact+bonusArmureDefense+bonusArmureContact,
            distance:bonusArmeDistance+bonusArmureDefense
          }
        },
        armures:{
          malus:{
            physique:malusArmurePhysique
          },
        },
        reserves:{
          bonus:{
            armure:bonusArmureDefense
          }
        }
      }
    }

    this.actor.update(bonus);
  }

  _prepareCharacterReserves(sheetData) {
    const wpnWear = sheetData.actor.armement.equipped;
    const actorData = sheetData.data.system;
    const reservesData = actorData.reserves;
    const combatData = actorData.combat;
    const bonusArmure = reservesData?.bonus?.armure || 0;

    const vitalite = actorData.vitalite.value;
    const subVitalite = actorData.vitalite.subValue;
    let result = false;

    switch(vitalite) {
      case -1:
      case -2:
      case -3:
      case -4:
        result = -1;
      break;

      case 0:
        if(subVitalite === 2) {
          result = 5;
        } else if(subVitalite === 1) {
          result = 8;
        }
        break;

      case 1:
        if(subVitalite === 2) {
          result = 8;
        } else if(subVitalite === 1) {
          result = 9;
        }
        break;

      case 2:
        if(subVitalite === 2) {
          result = 9;
        } else if(subVitalite === 1) {
          result = 10;
        }
        break;

      case 3:
        if(subVitalite === 2) {
          result = 10;
        } else if(subVitalite === 1) {
          result = 11;
        }
        break;

      case 4:
        if(subVitalite === 2) {
          result = 11;
        } else if(subVitalite === 1) {
          result = 12;
        }
        break;

      case 5:
        result = 12;
        break;

      case 6:
        if(subVitalite === 2) {
          result = 12;
        } else if(subVitalite === 1) {
          result = false;
        }
        break;
    }

    let rTotal = 0;

    if(result === -1) {
      rTotal = 0;
    } else {
      if(wpnWear.contact > 0) {
        rTotal = combatData.auContact+reservesData.modificateur;
      } else if(wpnWear.distance > 0) {
        rTotal = combatData.aDistance+reservesData.modificateur;
      } else {
        rTotal = combatData.mainsNues+reservesData.modificateur;
      }

      if(rTotal > result && result != false) { rTotal = result; }
    }

    reservesData.total = rTotal;
    reservesData.defense.min = bonusArmure;

    if(reservesData.defense.value < bonusArmure) { reservesData.defense.value = bonusArmure; }

    const attaque = sheetData.data.system.reserves.attaque.value;
    const defense = sheetData.data.system.reserves.defense.value;
    const total = attaque+defense;

    if(total > rTotal) {
      reservesData.defense.value = bonusArmure;
      reservesData.attaque.value = reservesData.total-bonusArmure;
    }
  }

  async _onRoll(event) {
    const label = $(event.currentTarget).data("label");

    const rollDialog = `
      <label style="display:flex;width:100%;align-items:flex-end;align-content:flex-end;">
        <span style="width:max-content;font-weight:bold;white-space:nowrap;">${game.i18n.localize("AWAKEN.ROLL.Modificateur")} : </span>
        <input style="width:100%;text-align:center;background:transparent;border-top:0px;border-left:0px;border-right:0px;border-radius:0px;margin-left:5px;padding-top:10px;" type="number" id="mod" value="0" />
      </label>
      `;

    new Dialog({
      title: this.actor.name+" : "+label,
      content: rollDialog,
      buttons: {
        button1: {
          label: game.i18n.localize("AWAKEN.ROLL.DIALOG.Valider"),
          callback: async (html) => {
            const mod = +html.find("input#mod").val();

            const attribut = +$(event.currentTarget).data("attribut");
            const competence = +$(event.currentTarget).data("competence") || 0;
            const bonus = +$(event.currentTarget).data("bonus") || 0;
            const hasMalus = $(event.currentTarget).data("malus") || false;
            const hasDifficulte = $(event.currentTarget).data("difficulte") || false;
            const isProdige = $(event.currentTarget).data("prodige") || false;
            const malus = +this.getData().data.system.corruption.malus || 0;
            const malusPhysique = +this.getData().data.system?.armures?.malus?.physique || 0;
            const max = this._getMaxDices() || -1;

            let dices = attribut+competence+bonus+mod;
            let notRoll = false;

            if(hasMalus === true) {
              dices += malus;
              dices -= malusPhysique;
            }

            if(dices <= 0) { dices = 1 }

            if(max === -1) {
              notRoll = true;
            } else if(max < dices) {
              dices = max;
            }

            const roll = await new game.awaken.RollAwaken(`${dices}D6cs>=5`, this.actor.system);

            roll.awaken.label = label;
            roll.awaken.hasDifficulte = hasDifficulte;
            roll.awaken.notRoll = notRoll;

            if(hasDifficulte) { roll.awaken.difficulte = attribut+competence+bonus; }
            if(isProdige) {
              roll.awaken.isProdige = true;
              roll.awaken.prodigeType = $(event.currentTarget).data("type") || "";
              roll.awaken.prodigeActivation = $(event.currentTarget).data("activation") || "";
              roll.awaken.prodigeDuree = $(event.currentTarget).data("duree") || "";
              roll.awaken.prodigeDescription = $(event.currentTarget).data("description") || "";
            }

            await roll.toMessage({
              speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
              }
            });
          },
          icon: `<i class="fas fa-check"></i>`
        },
        button2: {
          label: game.i18n.localize("AWAKEN.ROLL.DIALOG.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    }).render(true);
  }

  async _onRollVertus(event) {
    const label = $(event.currentTarget).data("label");

    const rollDialog = `
      <label style="display:flex;width:100%;align-items:flex-end;align-content:flex-end;">
        <span style="width:max-content;font-weight:bold;white-space:nowrap;">${game.i18n.localize("AWAKEN.ROLL.Modificateur")} : </span>
        <input style="width:100%;text-align:center;background:transparent;border-top:0px;border-left:0px;border-right:0px;border-radius:0px;margin-left:5px;padding-top:10px;" type="number" id="mod" value="0" />
      </label>
      `;

    new Dialog({
      title: this.actor.name+" : "+label,
      content: rollDialog,
      buttons: {
        button1: {
          label: game.i18n.localize("AWAKEN.ROLL.DIALOG.Valider"),
          callback: async (html) => {
            const mod = +html.find("input#mod").val();
            const vertu = $(event.currentTarget).data("vertus");
            const depense = this.getData().data.system.vertus[vertu].depense;
            const value = +this.getData().data.system.vertus[vertu].value;

            let dice = 0;

            if(vertu != "courage") {
              switch(value) {
                case 5:
                  if(depense.b5.used === false) { dice = 5; }
                  else if(depense.b4.used === false) { dice = 4; }
                  else if(depense.b3.used === false) { dice = 3; }
                  else if(depense.b2.used === false) { dice = 2; }
                  else if(depense.b1.used === false) { dice = 1; }
                  break;

                case 4:
                  if(depense.b4.used === false) { dice = 4; }
                  else if(depense.b3.used === false) { dice = 3; }
                  else if(depense.b2.used === false) { dice = 2; }
                  else if(depense.b1.used === false) { dice = 1; }
                  break;

                case 3:
                  if(depense.b3.used === false) { dice = 3; }
                  else if(depense.b2.used === false) { dice = 2; }
                  else if(depense.b1.used === false) { dice = 1; }
                  break;

                case 2:
                  if(depense.b2.used === false) { dice = 2; }
                  else if(depense.b1.used === false) { dice = 1; }
                  break;

                case 1:
                  if(depense.b1.used === false) { dice = 1; }
                  break;
              }
            } else {
              dice = value;
            }

            dice += mod;

            const roll = await new game.awaken.RollAwaken(`${dice}D6cs>=5`, this.actor.system);
            roll.awaken.label = label;

            await roll.toMessage({
              speaker: {
              actor: this.actor?.id || null,
              token: this.actor?.token?.id || null,
              alias: this.actor?.name || null,
              }
            });
          },
          icon: `<i class="fas fa-check"></i>`
        },
        button2: {
          label: game.i18n.localize("AWAKEN.ROLL.DIALOG.Annuler"),
          icon: `<i class="fas fa-times"></i>`
        }
      }
    }).render(true);
  }

  async _onRollCombat(event) {
    const label = $(event.currentTarget).data("label");
    const hasMalus = $(event.currentTarget).data("malus") || false;
    const malus = +this.getData().data.system.corruption.malus || 0;
    const max = this._getMaxDices() || -1;

    let notRoll = false;

    if(max === -1) {
      notRoll = true;
    }

    let attaque = $(event.currentTarget).data("attaque") || false;
    let defense = $(event.currentTarget).data("defense") || false;

    if(hasMalus === true) {
      attaque += malus
      defense += malus
    }

    const rollAttaque = await new game.awaken.RollAwaken(`${attaque}D6cs>=5`, this.actor.system);
    const rollDefense = await new game.awaken.RollAwaken(`${defense}D6cs>=5`, this.actor.system);

    rollAttaque.awaken.label = label+" / "+game.i18n.localize("AWAKEN.COMBAT.RESERVES.Attaque");
    rollAttaque.awaken.notRoll = notRoll;

    rollAttaque.awaken.isCombat = true;
    rollAttaque.awaken.isAttaque = true;
    rollAttaque.awaken.combatArme = $(event.currentTarget).data("arme") || "";
    rollAttaque.awaken.combatType = $(event.currentTarget).data("type") || "";
    rollAttaque.awaken.combatTypeDegats = $(event.currentTarget).data("typedegats").replace(" / ", "<br/>") || "";
    rollAttaque.awaken.combatDgts = $(event.currentTarget).data("dgts") || "";
    rollAttaque.awaken.combatDescription = $(event.currentTarget).data("description") || "";

    rollDefense.awaken.label = label+" / "+game.i18n.localize("AWAKEN.COMBAT.RESERVES.Defense");
    rollDefense.awaken.notRoll = notRoll;
    rollDefense.awaken.isCombat = true;
    rollDefense.awaken.isDefense = true;

    await rollAttaque.toMessage({
      speaker: {
      actor: this.actor?.id || null,
      token: this.actor?.token?.id || null,
      alias: this.actor?.name || null,
      }
    });

    await rollDefense.toMessage({
      speaker: {
      actor: this.actor?.id || null,
      token: this.actor?.token?.id || null,
      alias: this.actor?.name || null,
      }
    });
  }

  _getWpnStats() {
    let result = {};

    const contact = +this.actor.armement.equipped.contact;
    const distance = +this.actor.armement.equipped.distance;

    result.contact = contact;
    result.distance = distance;

    return result;
  }

  _getMaxDices() {
    const vitalite = this.getData().data.system.vitalite.value;
    const subVitalite = this.getData().data.system.vitalite.subValue;
    let result = false;

    switch(vitalite) {
      case -1:
      case -2:
      case -3:
      case -4:
        result = -1;
      break;

      case 0:
        if(subVitalite === 2) {
          result = 5;
        } else if(subVitalite === 1) {
          result = 8;
        }
        break;

      case 1:
        if(subVitalite === 2) {
          result = 8;
        } else if(subVitalite === 1) {
          result = 9;
        }
        break;

      case 2:
        if(subVitalite === 2) {
          result = 9;
        } else if(subVitalite === 1) {
          result = 10;
        }
        break;

      case 3:
        if(subVitalite === 2) {
          result = 10;
        } else if(subVitalite === 1) {
          result = 11;
        }
        break;

      case 4:
        if(subVitalite === 2) {
          result = 11;
        } else if(subVitalite === 1) {
          result = 12;
        }
        break;

      case 5:
        result = 12;
        break;

      case 6:
        if(subVitalite === 2) {
          result = 12;
        } else if(subVitalite === 1) {
          result = false;
        }
        break;
    }

    return result;
  }
}