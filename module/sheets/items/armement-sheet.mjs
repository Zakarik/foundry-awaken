/**
 * @extends {ItemSheet}
 */
export class AwakenArmementSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["awaken", "sheet", "item", "armement"],
      template: "systems/awaken/templates/items/armement-sheet.html",
      width: 700,
      height: 350,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    context.data.data.labelType = game.i18n.localize(CONFIG.AWAKEN.armement[context.data.data.type]);
    context.data.data.labelTypeDegats = game.i18n.localize(CONFIG.AWAKEN.armement[context.data.data.typeDegats]);
    context.systemData = context.data.data;

    return context;
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if ( !this.isEditable ) return;
  }
}
