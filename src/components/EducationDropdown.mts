import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';

@customElement('education-dropdown')
export class EducationDropdown extends Provider {
	render() {
		return html` <label for="education-level">
			Education Level
			<select id="education-level" @change=${this.handleChange}>
				<option disabed selected value>None Selected</option>
				${this.state.educationLevels.map(
					educationLevel =>
						html`<option
							?selected=${this.state.selectedEducationLevel === educationLevel}
						>
							${educationLevel}
						</option>`
				)}
			</select>
		</label>`;
	}

	private handleChange(e: InputEvent & { target: { value: string } }) {
		this.state.setEducationLevel(e.target.value);
	}
}
