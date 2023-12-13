import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';
import { html } from 'lit';
import { live } from 'lit/directives/live.js';

@customElement('education-dropdown')
export class EducationDropdown extends Provider {
	render() {
		return html`
			<select @change=${this.handleChange}>
				<option disabed selected value>Select Targeted Education Level</option>
				${this.state.educationLevels.map(
					educationLevel =>
						html`<option
							?selected=${this.state.selectedEducationLevel === educationLevel}
						>
							${educationLevel}
						</option>`
				)}
			</select>
		`;
	}

	private handleChange(e: InputEvent & { target: { value: string } }) {
		this.state.setEducationLevel(e.target.value);
	}
}
