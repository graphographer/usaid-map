import { html } from 'lit';
import { Provider } from './Provider.mjs';
import { customElement } from 'lit/decorators.js';
import './CountryDropdown.mjs';
import './UsgMap.mjs';

@customElement('usg-app')
export class UsgApp extends Provider {
	render() {
		return html` <div>
				<country-dropdown></country-dropdown>
			</div>
			<p>${this.state.selectedCountry}</p>
			<usg-map></usg-map>`;
	}
}
