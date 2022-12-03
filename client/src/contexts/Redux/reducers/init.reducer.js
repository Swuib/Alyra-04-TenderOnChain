import { 
    OWNER_REQUEST,
    OWNER_SUCCESS,
    OWNER_FAIL,
    CLEAR_DATA_SUCCESS,
    CLEAR_DATA_FAIL,
    USER_DATA_REQUEST,
    USER_DATA_SUCCESS,
    USER_DATA_FAIL,
    USER_ERR_REQUEST,
    USER_ERR_SUCCESS,
    USER_ERR_FAIL,
    CLEAR_ERRORS
} from "../actions/init.actions";

// const initialStateWeb3 = {
//     web3Loading: false,
//     web3Connected: false,
//     artifact: null,
//     web3: null,
//     networkID: null,
//     contract: null
// };

export const  ownerReducer = (state = {} , action) => {
    switch (action.type) {
        case OWNER_REQUEST:
        return {
            ownerLoading: true,
            owner: null
        };
        case OWNER_SUCCESS:
        return {
            ...state,
            ownerLoading: false,
            owner: action.payload.owner
        };
        case CLEAR_DATA_SUCCESS:
        return {
            ...state,
            ownerLoading: false,
            owner: null
        };
        case OWNER_FAIL:
        case CLEAR_DATA_FAIL:
        return {
            ...state,
            ownerLoading: false,
            error: action.payload,
        };
        case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
        default:
            return state;
    }
}

export const  userReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DATA_REQUEST:
        return {
            userDataLoading: true,
            userConnected: false,
            adresseValidateur: null,
            dateApprouval: null,
            isApproval: null,
            isAuditor: null,
            isRegistred: null,
            name: null
        };
        case USER_DATA_SUCCESS:
        return {
            ...state,
            userDataLoading: false,
            userConnected: true,
            adresseValidateur: action.payload.adresseValidateur,
            dateApprouval: action.payload.dateApprouval,
            isApproval: action.payload.isApproval,
            isAuditor: action.payload.isAuditor,
            isRegistred: action.payload.isRegistred,
            name: action.payload.name
        };
        case CLEAR_DATA_SUCCESS:
        return {
            ...state,
            userDataLoading: false,
            userConnected: false,
            adresseValidateur: null,
            dateApprouval: null,
            isApproval: null,
            isAuditor: null,
            isRegistred: null,
            name: null
        };
        case USER_DATA_FAIL:
        case CLEAR_DATA_FAIL:
        return {
            ...state,
            userDataLoading: false,
            userConnected: false,
            error: action.payload,
        };
        case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
        default:
            return state;
    }
}
export const  userErrReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_ERR_REQUEST:
        return {
            userError: ''
        };
        case USER_ERR_SUCCESS:
        return {
            ...state,
            userError: action.payload.userError
        };
        case CLEAR_DATA_SUCCESS:
        return {
            ...state,
            userError: ''
        };
        case USER_ERR_FAIL:
        case CLEAR_DATA_FAIL:
        return {
            ...state,
            usererror: '',
            error: action.payload,
        };
        case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
        default:
            return state;
    }
}


