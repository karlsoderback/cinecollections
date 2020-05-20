import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';


import App from './App';
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { Router, Route, browserHistory } from "react-router";
import {syncHistoryWithStore, routerReducer } from "react-router-redux";
//import history from "./components/history";
import * as reducers from "./redux/reducers";


import Startscreen from "./pages/startscreen.js";
import Profile from "./pages/profile.js";


const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer
  })
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  /*<React.StrictMode>
    <Router history={history}>
      <App />
    </Router>
  </React.StrictMode>*/

  <Provider store={store}>
    <Router history={history}>
      <Route exact path="/" component={App} />
      <Route exact path="/start" exact component={Startscreen} />
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
