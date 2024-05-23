// Import document classes.
import { AwakenActor } from "./documents/actor.mjs";
import { AwakenItem } from "./documents/item.mjs";
import { RollAwaken } from "./documents/roll.mjs";
// Import sheet classes.
import { AwakenActorSheet } from "./sheets/actor-sheet.mjs";
import { AwakenEquipementSheet } from "./sheets/items/equipement-sheet.mjs";
import { AwakenReputationSheet } from "./sheets/items/reputation-sheet.mjs";
import { AwakenSpecialisationSheet } from "./sheets/items/specialisation-sheet.mjs";
import { AwakenProdigeSheet } from "./sheets/items/prodige-sheet.mjs";
import { AwakenArmementSheet } from "./sheets/items/armement-sheet.mjs";
import { AwakenArmureSheet } from "./sheets/items/armure-sheet.mjs";
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from "./helpers/templates.mjs";
import { AWAKEN } from "./helpers/config.mjs";

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', async function() {

  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.awaken = {
    applications: {
      AwakenActorSheet,
    },
    documents:{
      AwakenActor,
      AwakenItem
    },
    RollAwaken,
    RollAwakenMacro
  };

  // Add custom constants for configuration.
  CONFIG.AWAKEN = AWAKEN;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "0",
    decimals: 2
  };

  // Define custom Roll class
  CONFIG.Dice.rolls.unshift(RollAwaken);

  // Define custom Document classes
  CONFIG.Actor.documentClass = AwakenActor;
  CONFIG.Item.documentClass = AwakenItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);

  Actors.registerSheet("awaken", AwakenActorSheet, {
    types: ["pj"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenEquipementSheet, {
    types: ["equipement"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenReputationSheet, {
    types: ["reputation"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenSpecialisationSheet, {
    types: ["specialisation"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenProdigeSheet, {
    types: ["prodige"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenArmementSheet, {
    types: ["armement"],
    makeDefault: true
  });

  Items.registerSheet("awaken", AwakenArmureSheet, {
    types: ["armure"],
    makeDefault: true
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once("ready", async function() {
  Hooks.on("hotbarDrop", (bar, data, slot) => createMacro(data, slot));
});

async function createMacro(data, slot) {
  // Create the macro command
  const type = data.type;
  const command = `game.awaken.RollAwakenMacro("${data.actorId}", "${type}", "${data.attr}", "${data.comp}", "${data.itemId}");`;

  let img = "";

  if(type === "specialisation" || type === "prodige") {
    if(data.itemId != 0) {
      const item = game.actors.get(data.actorId).items.find(i => i.id === data.itemId);
      img = item.img;
    }
  }
  if(type === "famille") {
    switch(data.attr) {
      case "esprit":
        img = "systems/awaken/assets/icons/esprit.svg";
        break;

      case "illusion":
        img = "systems/awaken/assets/icons/illusion.svg";
        break;

      case "realite":
        img = "systems/awaken/assets/icons/realite.svg";
        break;

      case "corps":
        img = "systems/awaken/assets/icons/corps.svg";
        break;
    }
   }

   if(type === "competence" || type === "vertus") { img = "systems/awaken/assets/icons/D6Black.svg"; }

  let macro = await Macro.create({
    name: data.label,
    type: "script",
    img: img,
    command: command,
    flags: { "awaken.attributMacro": true }
  });
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

async function RollAwakenMacro(id, type, attr, comp, itemId) {
  const speaker = ChatMessage.getSpeaker();

  let actor;
  if (speaker.token) actor = game.actors.tokens[speaker.token];
  if (!actor) actor = game.actors.get(speaker.actor);
  if (!actor) actor = game.actors.get(id);

  let item = 0
  if(itemId != 0) {
    item = actor.items.find(i => i.id === itemId);
  }

  const data = actor.data.data;
  const max = getMaxDices(data.vitalite.value, data.vitalite.subValue);

  let label = game.i18n.localize(CONFIG.AWAKEN.competences[comp]);
  let notRoll = false;

  if(type === "specialisation" && item != 0) { label += ` (${item.name})`}
  if(type === "prodige" && item != 0) { label = item.name; }
  if(type === "vertus") { label = game.i18n.localize(CONFIG.AWAKEN.vertus[attr]); }

  if(max === -1) {
    notRoll = true;
    const nRoll = await new game.awaken.RollAwaken(`0D6cs>=5`, data);
    nRoll.awaken.label = label;
    nRoll.awaken.notRoll = notRoll;
    await nRoll.toMessage({
      speaker: {
      actor: actor?.id || null,
      token: actor?.token?.id || null,
      alias: actor?.name || null,
      }
    });
  } else {
    const rollDialog = `
      <label style="display:flex;width:100%;align-items:flex-end;align-content:flex-end;">
        <span style="width:max-content;font-weight:bold;white-space:nowrap;">${game.i18n.localize("AWAKEN.ROLL.Modificateur")} : </span>
        <input style="width:100%;text-align:center;background:transparent;border-top:0px;border-left:0px;border-right:0px;border-radius:0px;margin-left:5px;padding-top:10px;" type="number" id="mod" value="0" />
      </label>
      `;

    new Dialog({
      title: actor.name+" : "+label,
      content: rollDialog,
      buttons: {
        button1: {
          label: game.i18n.localize("AWAKEN.ROLL.DIALOG.Valider"),
          callback: async (html) => {
            const mod = +html.find("input#mod").val();

            const hasMalus = data.attributs[attr]?.malus || false;
            const malus = +data.corruption.malus || 0;
            const malusPhysique = +data?.armures?.malus?.physique || 0;

            let attribut = 0;
            let competence = 0;
            let bonus = 0;
            let hasDifficulte = false;
            let isProdige = false;

            let prodigeType = "";
            let prodigeActivation = "";
            let prodigeDuree = "";
            let prodigeDescription = "";

            if(type === "competence" || type === "specialisation") {
              attribut = +data.attributs[attr].value;
              competence = +data.attributs[attr].competences[comp].value;

              if(type === "specialisation") { bonus += 1; }

            } else if(type === "famille") {
              hasDifficulte = true;

              attribut = +data.prodiges[attr].value;
            } else if(type === "prodige") {
              isProdige = true;

              attribut = +data.prodiges[attr].value;
              prodigeType = game.i18n.localize(CONFIG.AWAKEN.prodiges[item.data.data.type]);
              prodigeActivation = item.data.data.activation;
              prodigeDuree = item.data.data.duree;
              prodigeDescription = item.data.data.description;
            } else if(type === "vertus") {
              let dice = 0;
              const value = +data.vertus[attr].value;

              if(attr != "courage") {
                const depense = data.vertus[attr].depense;

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

              attribut = dice;
            }

            let dices = attribut+competence+bonus+mod;

            if(hasMalus === true) {
              dices += malus;
              dices -= malusPhysique;
            }

            if(dices <= 0) { dices = 1 }

            if(max < dices && max != false) {
              dices = max;
            }

            const roll = await new game.awaken.RollAwaken(`${dices}D6cs>=5`, data);

            roll.awaken.label = label;
            roll.awaken.hasDifficulte = hasDifficulte;

            if(hasDifficulte) { roll.awaken.difficulte = attribut+competence+bonus; }
            if(isProdige) {
              roll.awaken.isProdige = true;
              roll.awaken.prodigeType = prodigeType || "";
              roll.awaken.prodigeActivation = prodigeActivation || "";
              roll.awaken.prodigeDuree = prodigeDuree || "";
              roll.awaken.prodigeDescription = prodigeDescription || "";
            }

            await roll.toMessage({
              speaker: {
              actor: actor?.id || null,
              token: actor?.token?.id || null,
              alias: actor?.name || null,
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


}

function getMaxDices(vitalite, subVitalite) {
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