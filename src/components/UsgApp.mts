import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './CountryDropdown.mjs';
import { Provider } from './Provider.mjs';
import './SkillsDropdown.mjs';
import './UsgMap.mjs';
import './EducationDropdown.mjs';

@customElement('usg-app')
export class UsgApp extends Provider {
	render() {
		return html` <div>
                    <country-dropdown></country-dropdown>
                    <education-dropdown></education-dropdown>
                    <skills-dropdown></skills-dropdown>
                </div>
				<p>${this.state.selectedCountry}</p>
				<usg-map></usg-map>
			</div>`;
	}
}
