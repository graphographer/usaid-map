import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';

@customElement('skills-dropdown')
export class SkillsDropdown extends Provider {
	render() {
		return html`
			<label for="common-skills">
				Common Skills
				<select id="common-skills" @change=${this.handleChange}>
					<option disabed selected value>None Selected</option>
					${this.state.allSkills.map(
						skill =>
							html`<option ?selected=${this.state.selectedSkill === skill}>
								${skill}
							</option>`
					)}
				</select>
			</label>
		`;
	}

	private handleChange({
		target: { value }
	}: InputEvent & { target: { value: string } }) {
		this.state.setSkillsMeasured(value);
	}
}
