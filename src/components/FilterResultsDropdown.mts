import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';
import { live } from 'lit/directives/live.js';

@customElement('filter-results-dropdown')
export class FilterResultsDropdown extends Provider {
	render() {
		return html` <label for="filter-results">
			${this.state.isFiltered
				? 'Countries with selected metrics'
				: 'Select a country'}
			<select id="filter-results" @change=${this.handleChange}>
				<option disabed selected value="">None Selected</option>
				${[...this.state.filteredCountries]
					.sort()
					.map(
						country =>
							html`<option
								.selected=${live(this.state.selectedCountry === country)}
							>
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
