import 'bulma';
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import { firebaseConfig } from './utils/firebase_config';
import { App } from './components/App';

firebase.initializeApp(firebaseConfig);
ReactDOM.render(<App />, document.getElementById('app'));
