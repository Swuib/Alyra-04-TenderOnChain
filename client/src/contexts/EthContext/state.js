const actions = {
  init: "INIT",
  // userInfo: "USERINFO",
  // userErr: "USERERR",
};

const initialState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  owner: null,
  userInfo: null,
  // setUserInfo: (value) => {},
  userErr: null,
  // setUserErr: (value) => {},
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      // console.log('data init');
      // console.log(data);
      return { ...state, ...data };
    //   case actions.userInfo:
    //     console.log('data userInfo');
    //     console.log(data);
    //     // return { userInfo: action.payload };
    //   return { ...state.userInfo, ...data };
    // case actions.userErr:
    //   return { ...state.userErr, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};
