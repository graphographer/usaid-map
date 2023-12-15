import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';
import { html } from 'lit';
import { live } from 'lit/directives/live.js';

@customElement('skills-dropdown')
export class SkillsDropdown extends Provider {
	render() {
		return html`
			<select @change=${this.handleChange}>
				<option disabed selected value>Select Targeted Skill</option>
				${this.state.allSkills.map(
					skill =>
						html`<option ?selected=${this.state.selectedSkill === skill}>
							${skill}
						</option>`
				)}
			</select>
		`;
	}

	private handleChange({
		target: { value }
	}: InputEvent & { target: { value: string } }) {
		this.state.setSkillsMeasured(value);
	}
}
