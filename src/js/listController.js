import items from "./api/items";
import itemsView from "./views/itemsView";

async function controlLoadItems() {
  try {
    // improve the id management
    const loadItems = await items.getItems();
    itemsView.render(loadItems);
    // update summary
  } catch (error) {
    console.error("Controller error:", error);
  }
}

async function controlSubmitNewItem(name, price, quantity) {
  await items.addItem(name, price, quantity);
  await controlLoadItems();
}

async function controlUpdateItemQuantity(id, quantity) {
  await items.updateItemQuantity(id, quantity);

  // delete item
  if (quantity === 0) {
    await items.deleteItem(id);
    await controlLoadItems();
  }
  // update summary
  itemsView.updateSummary(quantity, id);
}

async function controlUpdateItemControl(id, name, price, quantity) {
  await items.updateItem(id, name, price, quantity);
  await controlLoadItems();
}

async function init() {
  controlLoadItems();
  itemsView.quantityControlHandler(controlUpdateItemQuantity);
  itemsView.submitNewItemHandler(controlSubmitNewItem);
  itemsView.addItemHandler();
  itemsView.editItemHandler(controlUpdateItemControl);
  itemsView.formFieldHandler();
}

init();
