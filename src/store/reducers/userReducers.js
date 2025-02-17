import { createSlice } from "@reduxjs/toolkit"; 

const userInitialState = {userInfo: null}

const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUserInfo(state, action){ 
      state.userInfo = action.payload;
    },
    resetUserInfoo(state, action) {
      state.userInfo = null;
    },
  },
 
});

const userAction = userSlice.actions;
const userReducer = userSlice.reducer;

export {userAction, userReducer};