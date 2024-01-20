import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import {
	action,
	autorun,
	computed,
	makeObservable,
	observable,
	runInAction
} from 'mobx';
import './CountryDropdown.mjs';
import './EducationDropdown.mjs';
import { Provider } from './Provider.mjs';
import './SkillsDropdown.mjs';
import './ChallengesDropdown.mjs';
import './SelMap.mjs';
import { programInfo } from './templates/programInfo';
import { horizontalChecklist } from './templates/horizontalChecklist';

@customElement('usg-app')
export class UsgApp extends Provider {
	static styles = [
		...super.styles,
		css`
			:host {
				display: block;
			}
		`
	];

	constructor() {
		super();
		makeObservable(this, { containerWidth: observable });
	}

	render() {
		return html` <main class="container">
			<section>
				<country-dropdown></country-dropdown>

				<sel-map></sel-map>

				<div class="grid">
					<challenges-dropdown></challenges-dropdown>
					<education-dropdown></education-dropdown>
					<skills-dropdown></skills-dropdown>
				</div>
			</section>

			<div class="current-country">${this.state.selectedCountry}</div>

			${this.state.selectedCountry
				? html`
						<section>
							<h2>Education Level(s) Targeted by Projects</h2>
							${horizontalChecklist(this.educationLevelsList, this.cellsPerRow)}
						</section>
						<section>
							<h2>Skills Targeted by Activities for this Country</h2>
							${horizontalChecklist(this.skillsList, this.cellsPerRow)}
						</section>

						<section id="projects">
							<h2>Country Projects</h2>
							<p>
								<i
									>Note: Submitters are all at different points in their SEL/SS
									measurement processes. The information below indicates that a
									project was able to report specific action steps they are
									taking at the time of survey response. Lack of information
									here indicates that the project did not report any relevant
									information regarding action steps at this time.</i
								>
							</p>
							${[
								...this.state.projectsByCountry.get(this.state.selectedCountry)
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

	firstUpdated() {
		this.containerWidth =
			this.shadowRoot.querySelector('main.container').clientWidth;

		window.addEventListener('resize', this.resizeCallback.bind(this));

		this.disposers.push(
			() => window.removeEventListener('resize', this.resizeCallback),
			autorun(() => {
				this.state.selectedCountry;
				this.closeDetails();
			})
		);
	}

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

	containerWidth: number;

	@computed
	get cellsPerRow() {
		switch (this.containerWidth) {
			case 1130:
				return 6;
			case 920:
				return 6;
			case 700:
				return 5;
			case 510:
				return 3;
			default:
				return 3;
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
