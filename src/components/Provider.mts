import { MobxLitElement } from '@adobe/lit-mobx';
import { stateProvider } from '../models/state';

export class Provider extends MobxLitElement {
	protected get state() {
		return stateProvider.get();
	}
}
