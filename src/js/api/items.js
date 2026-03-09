import { supabase } from "../services/supabase.js";

const tempListId = "2d6e8673-15d8-4064-b61b-6399586e3466";
// Future improvement: change the supabase.tempListId for the listId selected by the user

// Add items
async function addItem(name, price, quantity) {
  const { data, error } = await supabase.from("items").insert([
    {
      list_id: tempListId,
      name: name,
      price: price,
      quantity: quantity,
    },
  ]);

  if (error) {
    console.error("Error on adding item", error.message);
    throw new Error(error.message);
  }

  return data;
}

// get items
async function getItems() {
  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("list_id", tempListId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error on fetching items", error.message);
    throw new Error(error.message);
  }

  return data;
}

// update item
async function updateItemQuantity(id, quantity) {
  const { data, error } = await supabase
    .from("items")
    .update({ quantity: quantity })
    .eq("id", id);

  if (error) {
    console.error("Error on updating item", error.message);
    throw new Error(error.message);
  }

  return data;
}

async function updateItem(id, name, price, quantity) {
  const { data, error } = await supabase
    .from("items")
    .update({ name: name, price: price, quantity: quantity })
    .eq("id", id);

  if (error) {
    console.error("Error on updating item", error.message);
    throw new Error(error.message);
  }

  return data;
}

// delete item
async function deleteItem(id) {
  const { data, error } = await supabase.from("items").delete().eq("id", id);

  if (error) {
    console.error("Error on deleting item", error.message);
    throw new Error(error.message);
  }
}

export default {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  updateItemQuantity,
};
