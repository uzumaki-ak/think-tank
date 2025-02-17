import { userAction } from "../reducers/userReducers";
export const logout = () => (dispatch) => {
dispatch(userAction.resetUserInfoo());

//removing account item from local storage

localStorage.removeItem("account");
  
};
