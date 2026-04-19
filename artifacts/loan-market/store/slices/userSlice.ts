import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";
import { MOCK_USERS } from "@/data/mockData";

interface UserState {
  users: User[];
}

const initialState: UserState = {
  users: MOCK_USERS,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    updateUser: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<User> }>
    ) => {
      const user = state.users.find((u) => u.id === action.payload.id);
      if (user) {
        Object.assign(user, action.payload.updates);
      }
    },
  },
});

export const { addUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
