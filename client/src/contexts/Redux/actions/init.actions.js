/*:::::::::::::::::::::::::::::::::::::::: CONSTANTES ::::::::::::::::::::::::::::::::::::::::*/

/**
 * @dev constantes for artifact, web3, networkID, contract
 */
export const OWNER_REQUEST = "OWNER_REQUEST";
export const OWNER_SUCCESS = "OWNER_SUCCESS";
export const OWNER_FAIL = "OWNER_FAIL";

export const CLEAR_DATA_SUCCESS = "CLEAR_DATA_SUCCESS";
export const CLEAR_DATA_FAIL = "CLEAR_DATA_FAIL";

/**
 * @dev constantes for userinfo
 */
export const USER_DATA_REQUEST = "USER_DATA_REQUEST";
export const USER_DATA_SUCCESS = "USER_DATA_SUCCESS";
export const USER_DATA_FAIL = "USER_DATA_FAIL";
/**
 * @dev constantes for usererror
 */
export const USER_ERR_REQUEST = "USER_DATA_REQUEST";
export const USER_ERR_SUCCESS = "USER_ERR_SUCCESS";
export const USER_ERR_FAIL = "USER_ERR_FAIL";

/**
 * @dev constantes for error
 */
export const CLEAR_ERRORS ='CLEAR_ERRORS';

/*:::::::::::::::::::::::::::::::::::::::::: ACTIONS ::::::::::::::::::::::::::::::::::::::::::*/

export const setOwner = (owner) => async (dispatch) => {
    try {
        dispatch({ type: OWNER_REQUEST });
        console.log(owner);
        dispatch({ type: OWNER_SUCCESS, payload: { owner } });
    } catch (err) {
        dispatch({ type: OWNER_FAIL, payload: err.message});
    };
};

export const clearData = () => async (dispatch) => {
    try {
        dispatch({ type: CLEAR_DATA_SUCCESS });
    } catch (err) {
        dispatch({ type: CLEAR_DATA_FAIL, payload: err.message});
    };
};

export const setUser = (data) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_DATA_REQUEST });
        dispatch({ type: USER_DATA_SUCCESS, payload: {
            adresseValidateur:data.adresseValidateur,
            dateApprouval:data.dateApprouval,
            isApproval:data.isApproval,
            isAuditor:data.isAuditor,
            isRegistred:data.isRegistred,
            name:data.name
         } });
    } catch (err) {
        dispatch({ type: USER_DATA_FAIL, payload: err.message});
    };
};

export const setUserErr = (data) => async (dispatch, getState) => {
    try {
        dispatch({ type: USER_ERR_REQUEST });
        dispatch({ type: USER_ERR_SUCCESS, payload: { userError: data } });
    } catch (err) {
        dispatch({ type: USER_ERR_FAIL, payload: err.message});
    };
};

export const clearErrors = () => async (dispatch) => {
    dispatch({ type: CLEAR_ERRORS });
};