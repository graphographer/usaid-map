import { makeAutoObservable, observable } from 'mobx';
import { TDataEntries } from './types';

export class State {
	selectedCountry: string = 'United States of America';

	constructor(private data: TDataEntries) {
		makeAutoObservable(this);
	}

	get countries() {
		return [...new Set(this.data.map(entry => entry.Country).flat())];
	}

	setSelectedCountry(country: string) {
		this.selectedCountry = country;
	}
}

export const stateProvider = observable.box<State | undefined>();
