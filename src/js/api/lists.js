import { supabase } from "../services/supabase.js";
const tempListId = "2d6e8673-15d8-4064-b61b-6399586e3466";

async function getListDetails() {
  const { data, error } = await supabase
    .from("lists")
    .select(
      `
      id,
      name,
      items (
        id,
        name,
        price,
        quantity
      ),
      list_friends (
        friends (
          id,
          name,
          avatar
        )
      )
    `,
    )
    .eq("id", tempListId)
    .single();

  if (error) {
    console.error(error);
    return;
  }

  return data;
}

// async function createList(name, userId) {
//   const { data, error } = await supabase.from("lists").insert([
//     {
//       name: name,
//       user_id: userId,
//     },
//   ]);

//   if (error) {
//     console.error(error);
//     return;
//   }

//   return data;
// }

// async function getList(listId) {
//   const { data, error } = await supabase
//     .from("lists")
//     .select("*")
//     .eq("id", listId)
//     .single();

//   if (error) {
//     console.error("Error:", error);
//   } else {
//     console.log("Dados:", data);
//   }

//   return data;
// }

// async function getAllLists() {
//   const { data, error } = await supabase.from("lists").select("*");

//   if (error) {
//     console.error(error);
//     return;
//   }

//   return data;
// }

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

//export default { createList, getList, getAllLists };
export default { getListDetails };
