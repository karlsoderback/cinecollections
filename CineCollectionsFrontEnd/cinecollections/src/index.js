import React from 'react';
import ReactDOM from 'react-dom';
import "./fonts/HollywoodHills/SFHollywoodHills.ttf";
import "./fonts/basketball/Basketball.otf";
import './index.css';
import * as serviceWorker from './serviceWorker';


import App from './App';
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Router, Route, browserHistory } from "react-router";
import { syncHistoryWithStore, routerReducer } from "react-router-redux";
import * as reducers from "./redux/reducers";

import Profile from "./components/profile";


const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
);

store.subscribe(() => 
    console.log(store.getState()) // TODO - debug, remove
); 

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/" component={App} />
      <Route exact path="/profile" exact component={Profile} />
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
