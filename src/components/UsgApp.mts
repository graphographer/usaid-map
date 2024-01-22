import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { action, autorun, computed, makeObservable, observable } from 'mobx';
import './ChallengesDropdown.mjs';
import './CountryDropdown.mjs';
import './EducationDropdown.mjs';
import { Provider } from './Provider.mjs';
import './SelMap.mjs';
import './SkillsDropdown.mjs';
import { horizontalChecklist } from './templates/horizontalChecklist';
import { programInfo } from './templates/programInfo';

const PROJECT_INSTRUCTIONS = `Click on a project name below to see detailed information about the project background, SEL/SS skills measurement information, and action steps the project is taking to address SEL/SS measurement challenges.`;
const COMMON_SKILLS_NOTE =
	'Please note that “common skills” reflect those that were most frequently reported among survey respondents. The inclusion of these particular skills within the filter does not indicate USAID and/or UNICEF endorsement of this terminology or these particular skills for the given context.';

@customElement('usg-app')
export class UsgApp extends Provider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
				margin-top: var(--spacing);
			}

			#common-skills-definition {
				z-index: 1200;
			}
		`
	];

	constructor() {
		super();

		makeObservable(this, {
			containerWidth: observable,
			modalIsOpen: observable,
			setModalIsOpen: action
		});

		this.addEventListener('click', this.handleClick.bind(this));
		this.addEventListener('keydown', e => {
			if (e.key === 'Escape' && this.modalIsOpen) {
				this.setModalIsOpen(false);
			}
		});
	}

	render() {
		return html` ${this.skillsNote}
			<main class="container">
				<section>
					<country-dropdown></country-dropdown>

					<sel-map></sel-map>

					<div class="grid">
						<challenges-dropdown></challenges-dropdown>
						<education-dropdown></education-dropdown>
						<skills-dropdown></skills-dropdown>
					</div>
				</section>

				<div tabindex="0" id="current-country">
					${this.state.selectedCountry}
				</div>

				${this.state.selectedCountry
					? html`
							<section>
								<h2>Education Level(s) Targeted by Projects in this Country</h2>
								${horizontalChecklist(
									this.educationLevelsList,
									this.cellsPerRow
								)}
							</section>
							<section>
								<h2>
									Common Skills<sup class="info"
										><button
											class="link info"
											data-target="#common-skills-definition"
										>
											?
											<span class="sr-only">Definition of "Common Skills"</span>
										</button></sup
									>
									Targeted by Projects for this Country
								</h2>
								${horizontalChecklist(this.skillsList, this.cellsPerRow)}
							</section>

							<section id="projects">
								<h2>Projects in this Country Addressing SEL/SS Measurement</h2>
								<p>
									<em>${PROJECT_INSTRUCTIONS}</em>
								</p>
								${[
									...this.state.projectsByCountry.get(
										this.state.selectedCountry
									)
								].map(project => {
									return html`<details>
										${programInfo(
											project,
											this.state.challengesByProject.get(project),
											this.state.assessmentTypesByProject.get(project)
										)}
									</details>`;
								})}
							</section>
					  `
					: ''}
			</main>`;
	}

	get skillsNote() {
		return html`<dialog
			tabindex="0"
			id="common-skills-definition"
			?open=${this.modalIsOpen}
			role="dialog"
			aria-labelledby="title"
			aria-describedby="description"
			aria-modal="true"
		>
			<article>
				<header id="title">
					<button
						data-target="#close-modal"
						aria-label="close"
						class="link close"
					></button>
					"Common Skills"
				</header>
				<p id="description">${COMMON_SKILLS_NOTE}</p>
			</article>
		</dialog>`;
	}

	private handleClick(e) {
		const [target] = e.composedPath();

		if (target.dataset.target === '#close-modal') {
			this.setModalIsOpen(false);
		} else if (target.dataset.target === '#common-skills-definition') {
			this.setModalIsOpen(true);
		}
	}

	firstUpdated() {
		this.containerWidth =
			this.shadowRoot.querySelector('main.container').clientWidth;

		window.addEventListener('resize', this.resizeCallback.bind(this));

		this.disposers.push(
			() => window.removeEventListener('resize', this.resizeCallback),
			autorun(() => {
				this.state.selectedCountry;
				this.closeDetails();
				// this.shadowRoot.getElementById('current-country').focus();
			})
		);
	}

	private previouslyActiveElement: HTMLElement;
	setModalIsOpen(val: boolean) {
		this.modalIsOpen = val;

		const modal = this.shadowRoot.getElementById('common-skills-definition');
		if (val) {
			this.previouslyActiveElement = this.shadowRoot
				.activeElement as HTMLElement;
			setTimeout(() => {
				modal.focus();
				console.log('FOCUSED', this.shadowRoot.activeElement);
			});
		} else {
			// this.shadowRoot.getElementById('common-skills-definition').blur();
			setTimeout(() => {
				this.previouslyActiveElement?.focus();
			});
		}
	}
	modalIsOpen: boolean = false;

	@action
	private resizeCallback(e: Event) {
		this.containerWidth =
			this.shadowRoot.querySelector('main.container').clientWidth;
	}

	private async closeDetails() {
		await this.updateComplete;
		this.shadowRoot
			.querySelectorAll('details')
			.forEach(detail => detail.removeAttribute('open'));
	}

	containerWidth: number = 0;

	@computed
	get cellsPerRow() {
		switch (this.containerWidth) {
			case 1130:
				return 7;
			case 920:
				return 7;
			case 700:
				return 6;
			case 510:
				return 4;
			default:
				return 4;
		}
	}

	@computed
	get educationLevelsList(): [string, boolean][] {
		if (!this.state.selectedCountry) return [];

		return this.state.educationLevels.map(level => [
			level,
			this.state.selectedCountryEducationLevels.includes(level)
		]);
	}

	@computed
	get skillsList(): [string, boolean][] {
		if (!this.state.selectedCountry) return [];

		return this.state.allSkills.map(skill => [
			skill,
			this.state.selectedCountrySkills.includes(skill)
		]);
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
