import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { computed } from 'mobx';
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
							<h3>Education Level(s) Targeted by Projects</h3>
							${horizontalChecklist(this.educationLevelsList)}
						</section>
						<section>
							<h3>Skills Targeted by Activities for this Country</h3>
							${horizontalChecklist(this.skillsList)}
						</section>

						<section id="projects">
							<h3>Country Projects</h3>
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
