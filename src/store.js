import {createStore, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from './reducer';
import rootSaga from './saga';

export const sagaMiddleware = createSagaMiddleware();

// const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;


   // Create the Redux store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
console.log('STORE', store)
// Run the root saga
sagaMiddleware.run(rootSaga);

export default store;


