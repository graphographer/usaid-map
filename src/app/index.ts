import { State, stateProvider } from '../models/state';
import '../components/UsgApp.mjs';
import { TDataEntries } from '../models/types';
import 'style-loader!../components/styles/light-dom.css';

async function start() {
	const usgData = (await import('../data/usaid_data.csv'))
		.default as TDataEntries;

	const state = new State(usgData);
	stateProvider.set(state);

	// @ts-ignore
	window.state = state;

	document.body.innerHTML = '<usg-app></usg-app>';
}

start();
