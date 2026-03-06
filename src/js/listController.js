import items from "./api/items";
import itemsView from "./views/itemsView";

async function loadItems() {
  try {
    // improve the id management
    const loadItems = await items.getItems();
    itemsView.render(loadItems);
  } catch (error) {
    console.error("Controller error:", error);
  }
}

async function submitNewItem(name, price, quantity) {
  await items.addItem(name, price, quantity);
  await loadItems();
}

async function updateItemQuantity(id, quantity) {
  await items.updateItem(id, quantity);
}

async function init() {
  loadItems();
  itemsView.quantityControlHandler(updateItemQuantity);
  itemsView.submitNewItemHandler(submitNewItem);
  itemsView.addItemHandler();
  itemsView.formFieldHandler();
  //   itemsView.dialogQuantityHandler();
}

init();
