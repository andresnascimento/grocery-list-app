import items from "./api/items";
import list from "./api/lists";
import friends from "./api/friends";
import itemsView from "./views/itemsView";

async function controlLoadItems() {
  try {
    // FUTURE IMPROVE: list id management
    const loadListDetails = await list.getListDetails();
    itemsView.render(loadListDetails);
    // update summary
  } catch (error) {
    console.error("Controller error:", error);
  }
}

async function controlSubmitNewItem(name, price, quantity) {
  await items.addItem(name, price, quantity);
  await controlLoadItems();
}

async function addFriend(name, avatar) {
  const friend = await friends.createFriend(name, avatar);

  await friends.addFriendToList(friend.id);
  await controlLoadItems();
}

async function controlUpdateItemQuantity(id, quantity) {
  await items.updateItemQuantity(id, quantity);
  itemsView.updateSummary(quantity, id);
}

async function controlDeleteItem(quantity, id) {
  await items.deleteItem(id);
  itemsView.updateSummary(quantity, id);
  await controlLoadItems();
}

async function controlUpdateItemControl(id, name, price, quantity) {
  await items.updateItem(id, name, price, quantity);
  await controlLoadItems();
}

async function init() {
  controlLoadItems();
  itemsView.quantityControlHandler(controlUpdateItemQuantity);
  itemsView.deleteItemHandler(controlDeleteItem);
  itemsView.submitNewItemHandler(controlSubmitNewItem);
  itemsView.addItemHandler();
  itemsView.editItemHandler(controlUpdateItemControl);
  itemsView.formFieldHandler();
  //   itemsView.addNewFriendHandler(addFriend);
}

init();
