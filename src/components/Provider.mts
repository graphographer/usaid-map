import { MobxLitElement } from '@adobe/lit-mobx';
import { stateProvider } from '../models/state';

export class Provider extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	protected get state() {
		return stateProvider.get();
	}

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.disposers.forEach(disposer => disposer());
	}
}
