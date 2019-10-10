import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { HashRouter } from "react-router-dom";
//redux
import burgerBuyilderReducer from "./store/reducers/burgerBuilder";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
//thunk
import ReduxThunk from "redux-thunk";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  burgerBuyilderReducer,
  composeEnhancers(applyMiddleware(ReduxThunk))
);

const app = (
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
