import { supabase } from "../services/supabase.js";
const tempListId = "2d6e8673-15d8-4064-b61b-6399586e3466";
const tempUserId = "a9b10da6-2abb-449c-8dd1-feac179e20e2";

async function getFriends() {
  const { data, error } = await supabase
    .from("list_friends")
    .select(
      `
      friends (
        id,
        name,
        avatar
      )
    `,
    )
    .eq("list_id", tempListId);

  return data.map((el) => el.friends);
}

async function createFriend(name, avatar) {
  const { data, error } = await supabase
    .from("friends")
    .insert([
      {
        name: name,
        avatar: avatar,
        user_id: tempUserId,
      },
    ])
    .select()
    .single();

  return data;
}

async function addFriendToList(friendId) {
  const { data, error } = await supabase.from("list_friends").insert([
    {
      list_id: tempListId,
      friend_id: friendId,
    },
  ]);

  return data;
}

export default { getFriends, createFriend, addFriendToList };
