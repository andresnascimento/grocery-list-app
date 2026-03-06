import { supabase } from "../services/supabase.js";

async function createList(name, userId) {
  const { data, error } = await supabase.from("lists").insert([
    {
      name: name,
      user_id: userId,
    },
  ]);

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

async function getList(listId) {
  const { data, error } = await supabase
    .from("lists")
    .select("*")
    .eq("id", listId)
    .single();

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Dados:", data);
  }

  return data;
}

async function getAllLists() {
  const { data, error } = await supabase.from("lists").select("*");

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

// get list with items
// async function getListWithItems(listId) {
//   const { data, error } = await supabase
//     .from('lists')
//     .select(`
//       *,
//       items(*)
//     `)
//     .eq('id', listId)
//     .single()

//   return data
// }

export default { createList, getList, getAllLists };
