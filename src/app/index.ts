import usgData from '../data/usg_data.csv';
import { State, stateProvider } from '../models/state';
import '../components/UsgApp.mjs';

const state = new State(usgData);
stateProvider.set(state);

document.body.innerHTML = '<usg-app></usg-app>';
