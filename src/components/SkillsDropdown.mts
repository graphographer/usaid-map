import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Provider } from './Provider.mjs';
import { live } from 'lit/directives/live.js';
import { action, makeObservable, observable } from 'mobx';

const COMMON_SKILLS_NOTE =
	'Please note that “common skills” reflect those that were most frequently reported among survey respondents. The inclusion of these particular skills within the filter does not indicate USAID and/or UNICEF endorsement of this terminology or these particular skills for the given context.';

@customElement('skills-dropdown')
export class SkillsDropdown extends Provider {
	constructor() {
		super();

		makeObservable(this, {
			modalIsOpen: observable,
			toggleModalIsOpen: action
		});
	}
	static get styles() {
		return [
			...super.styles,
			css`
				dialog {
					z-index: 1200;
				}
			`
		];
	}

	modalIsOpen: boolean = false;

	toggleModalIsOpen() {
		this.modalIsOpen = !this.modalIsOpen;
	}

	render() {
		return html`
			<label for="common-skills">
				Common Skills
				<em
					><a href="javascript:void(0)" @click=${() => this.toggleModalIsOpen()}
						>?</a
					></em
				>
				<select id="common-skills" @change=${this.handleChange}>
					<option disabed selected value="">None Selected</option>
					${this.state.allSkills.map(
						skill =>
							html`<option
								.selected=${live(this.state.selectedSkill === skill)}
							>
								${skill}
							</option>`
					)}
				</select>
			</label>

			${this.skillsNote}
		`;
	}

	get skillsNote() {
		return html`<dialog ?open=${this.modalIsOpen}>
			<article>
				<p>${COMMON_SKILLS_NOTE}</p>
				<footer>
					<a
						href="javascript:void(0)"
						role="button"
						@click=${() => this.toggleModalIsOpen()}
					>
						Okay
					</a>
				</footer>
			</article>
		</dialog>`;
	}

	private handleChange({
		target: { value }
	}: InputEvent & { target: { value: string } }) {
		this.state.setSkillsMeasured(value);
	}
}
