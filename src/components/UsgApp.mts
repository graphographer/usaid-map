import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { autorun, computed } from 'mobx';
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
			#projects ul li {
				list-style-type: none;
			}

			ul.overview > li {
				margin-bottom: var(--typography-spacing-vertical);
			}

			section#projects summary {
				position: sticky;
				top: 0;
			}
		`
	];

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

			<h2>${this.state.selectedCountry}</h2>

			${this.state.selectedCountry
				? html`
						<section>
							<h4>Education Level(s) Targeted by Projects</h4>
							${horizontalChecklist(this.educationLevelsList)}
						</section>
						<section>
							<h4>Skills Targeted by Activities for this Country</h4>
							${horizontalChecklist(this.skillsList)}
						</section>

						<section id="projects">
							<h4>Country Projects</h4>
							${[
								...this.state.projectsByCountry.get(this.state.selectedCountry)
							].map(project => {
								return html`<details>
									${programInfo(
										project,
										this.state.challengesByProject.get(project)
									)}
								</details>`;
							})}
						</section>
				  `
				: ''}

			<pre><code>${this.prettyJson}</code></pre>
		</main>`;
	}

	firstUpdated() {
		this.disposers.push(
			autorun(() => {
				this.state.selectedCountry;
				this.closeDetails();
			})
		);
	}

	private async closeDetails() {
		await this.updateComplete;
		this.shadowRoot
			.querySelectorAll('details')
			.forEach(detail => detail.removeAttribute('open'));
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
