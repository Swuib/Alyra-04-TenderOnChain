/**
 * @dev library Redux
 * @doc_redux https://redux.js.org/
 */
import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';

/**
 * @dev Thunk middleware for Redux
 * @doc_redux_thunk https://github.com/reduxjs/redux-thunk
 */
import thunk from 'redux-thunk';

/**
 * @dev library to have a console feedback of what's going on in the redux store (Dev tool)
 * @doc_redux_devtools_extension https://github.com/zalmoxisus/redux-devtools-extension
 * @doc_redux_logger https://github.com/LogRocket/redux-logger#readme
 */
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';

/**
 * @dev library to persist the redux store (solution for page refresh) 
 * @doc_redux_persist https://www.npmjs.com/package/redux-persist
 */
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import createTransform from 'redux-persist/es/createTransform';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

/**
 * @dev library for local storage (JSON transformations)
 * @doc_flatted https://www.npmjs.com/package/flatted
 */
import { stringify, parse } from 'flatted';

/**
 * @dev reducers
 */
// import reducer from './reducers';
import { ownerReducer, userReducer,userErrReducer } from './reducers/init.reducer';

/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

const transformCircular = createTransform(
    (inboundState, key) => stringify(inboundState),
    (outboundState, key) => parse(outboundState),
)

const rootPersistConfig = {
    key: 'root',
    storage: storage,
    blacklist:['owner','user'],
    stateReconciler: autoMergeLevel2,
    transforms: [transformCircular]
};

const ownerPersistConfig = {
    key: 'owner',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    transforms: [transformCircular]
};

const userPersistConfig = {
    key: 'user',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    transforms: [transformCircular]
};
const userErrPersistConfig = {
    key: 'userErr',
    storage: storage,
    stateReconciler: autoMergeLevel2,
    transforms: [transformCircular]
};

const rootReducer = combineReducers({
    owner:persistReducer(ownerPersistConfig, ownerReducer),
    user:persistReducer(userPersistConfig, userReducer),
    userErr:persistReducer(userErrPersistConfig, userErrReducer)
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);



/*:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/

/**
 * @dev developpement => to use if you want the console return
 */
const middleware = [thunk, logger]; // comment for production
/**
 * @dev developpement => to use if you don't want the console return
 */
// const middleware = [thunk]; // comment for production

let initialState = {};

const store = createStore(
    persistedReducer,
    initialState,
    /**
     * @dev developpement
     */
    composeWithDevTools(applyMiddleware(...middleware)) // comment for production
    /**
     * @dev production
     */
    //applyMiddleware(thunk) // uncomment for production
);

const persistor = persistStore(store);

export { store, persistor };