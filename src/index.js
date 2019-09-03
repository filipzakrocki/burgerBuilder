import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {HashRouter} from 'react-router-dom'
//redux
import reducer from './store/reducer'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

const store = createStore(reducer);

const app = (
    <Provider store={store}>
        <HashRouter>
            <App/>
        </HashRouter>
    </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

