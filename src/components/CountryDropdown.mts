import { html } from 'lit-html';
import { Provider } from './Provider.mjs';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

@customElement('country-dropdown')
export class CountryDropdown extends Provider {
	render() {
		return html`<select @change=${this.handleChange}>
			<option disabed selected value>Select Country or Region</option>
			${this.state.allCountries.map(
				country =>
					html`<option ?selected=${this.state.selectedCountry === country}>
						${country}
					</option>`
			)}
		</select>`;
	}

	private handleChange(e: InputEvent & { target: { value: string } }) {
		console.log('CHANGE', e.target.value);
		this.state.setSelectedCountry(e.target.value);
	}
}
