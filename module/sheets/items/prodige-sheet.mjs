/**
 * @extends {ItemSheet}
 */
export class AwakenProdigeSheet extends ItemSheet {

  /** @inheritdoc */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["awaken", "sheet", "item", "prodige"],
      template: "systems/awaken/templates/items/prodige-sheet.html",
      width: 620,
      height: 450,
      scrollY: [".attributes"],
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  getData() {
    const context = super.getData();

    context.data.data.labelType = game.i18n.localize(CONFIG.AWAKEN.prodiges[context.data.data.type]);
    context.systemData = context.data.data;

    console.log(context);

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
