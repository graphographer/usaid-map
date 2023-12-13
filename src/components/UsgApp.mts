import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { computed } from 'mobx';
import './CountryDropdown.mjs';
import './EducationDropdown.mjs';
import { Provider } from './Provider.mjs';
import './SkillsDropdown.mjs';
import './UsgMap.mjs';

@customElement('usg-app')
export class UsgApp extends Provider {
	render() {
		return html` <div>
                    <country-dropdown></country-dropdown>
                    <education-dropdown></education-dropdown>
                    <skills-dropdown></skills-dropdown>
                </div>
				<usg-map></usg-map>
				<h2>${this.state.selectedCountry}</h2>
                <pre><code>${this.prettyJson}</code></pre>
			</div>`;
	}

	@computed
	get prettyJson() {
		if (!this.state.selectedCountry) return '';

		const entries = this.state.projectsByCountry.get(
			this.state.selectedCountry
		);

		return JSON.stringify(entries, undefined, 2);
	}
}
