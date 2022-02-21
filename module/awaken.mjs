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
    RollAwaken
  };

  // Add custom constants for configuration.
  CONFIG.AWAKEN = AWAKEN;

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@maitrises.physique.value",
    decimals: 2
  };

  console.log(CONFIG.Combat.initiative);

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

});