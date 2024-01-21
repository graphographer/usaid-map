import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';
import { live } from 'lit/directives/live.js';

@customElement('challenges-dropdown')
export class ChallengesDropdown extends Provider {
	render() {
		return html`
			<label for="challenge-area">
				SEL/SS measurement challenge area
				<select id="challenge-area" @change=${this.handleChange}>
					<option disabed selected value="">None Selected</option>
					${this.state.challengeAreas.map(
						(challenge) =>
							html`<option
								.selected=${live(
									this.state.selectedChallengeArea === challenge
								)}
							>
								${challenge}
							</option>`
					)}
				</select>
			</label>
		`;
	}

	private handleChange({
		target: { value },
	}: InputEvent & { target: { value: string } }) {
		this.state.setChallengeArea(value);
	}
}
