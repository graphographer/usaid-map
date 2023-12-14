import picoCss from '@picocss/pico/css/pico.css';
import { MobxLitElement } from '@adobe/lit-mobx';
import { css, unsafeCSS } from 'lit';
import { stateProvider } from '../models/state';
import shadowDomCss from './styles/shadow-dom.css';

export class Provider extends MobxLitElement {
	protected disposers: (() => void)[] = [];

	protected get state() {
		return stateProvider.get();
	}

	static styles = [
		unsafeCSS(picoCss.toString()),
		unsafeCSS(shadowDomCss.toString())
	];

	disconnectedCallback(): void {
		super.disconnectedCallback();
		this.disposers.forEach(disposer => disposer());
	}
}
