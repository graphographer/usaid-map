import { html } from 'lit-html';
import { Provider } from './Provider.mjs';
import { customElement } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';

@customElement('country-dropdown')
export class CountryDropdown extends Provider {
	render() {
		return html`<select @change=${this.handleSelect}>
			${[...this.state.countries].map(
				country =>
					html`<option selected=${live(this.state.selectedCountry)}>
						${country}
					</option>`
			)}
		</select>`;
	}

	private handleSelect(e: InputEvent & { target: { value: string } }) {
		console.log('CHANGE', e.target.value);
		this.state.setSelectedCountry(e.target.value);
	}
}
