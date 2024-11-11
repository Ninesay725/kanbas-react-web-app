import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
};

const peopleSlice = createSlice({
    name: "people",
    initialState,
    reducers: {
        setUsers: (state: any, action) => {
            state.users = action.payload;
        },
        addUser: (state: any, { payload: user }) => {
            state.users = [...state.users, user] as any;
        },
        deleteUser: (state: any, { payload: userId }) => {
            state.users = state.users.filter(
                (u: any) => u._id !== userId
            );
        },
        updateUser: (state: any, { payload: user }) => {
            state.users = state.users.map((u: any) =>
                u._id === user._id ? user : u
            ) as any;
        },
    },
});

export const { setUsers, addUser, deleteUser, updateUser } = 
    peopleSlice.actions;
export default peopleSlice.reducer; 