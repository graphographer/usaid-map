import { html } from 'lit-html';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';

@customElement('country-dropdown')
export class CountryDropdown extends Provider {
	render() {
		return html` <label for="countries">
			Select a country
			<select id="countries" @change=${this.handleChange}>
				<option disabed selected value>None Selected</option>
				${this.state.allCountries.map(
					country =>
						html`<option ?selected=${this.state.selectedCountry === country}>
							${country}
						</option>`
				)}
			</select>
		</label>`;
	}

	private handleChange(e: InputEvent & { target: { value: string } }) {
		this.state.setSelectedCountry(e.target.value);
	}
}
