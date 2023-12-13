import { makeAutoObservable, observable } from 'mobx';
import { TDataEntries, TDataEntry } from './types';

export class State {
	data: TDataEntries;

	selectedCountry: string = '';
	selectedEducationLevel: string = '';
	selectedSkill: string = '';

	constructor(data: TDataEntries) {
		this.data = data;

		makeAutoObservable(this, {
			data: false
		});
	}

	get allCountries() {
		return [...new Set(this.data.map(entry => entry.Country).flat())];
	}

	get filteredCountries() {
		const { selectedEducationLevel, selectedSkill } = this;

		if (!selectedEducationLevel && !selectedSkill) {
			return new Set();
		}

		const filteredCountries = new Set(
			this.data
				.filter(entry => {
					const { 'Level of Education': educationLevels, Skills: skills } =
						entry;

					if (selectedEducationLevel && selectedSkill) {
						return (
							educationLevels.includes(selectedEducationLevel) &&
							skills.includes(selectedSkill)
						);
					}

					return (
						educationLevels.includes(selectedEducationLevel) ||
						skills.includes(selectedSkill)
					);
				})
				.map(entry => entry.Country)
				.flat()
		);

		return filteredCountries;
	}

	get projectsByCountry() {
		const projectsByCountry = new Map<string, TDataEntries>(
			this.allCountries.map(country => [country, []])
		);

		this.data.forEach(entry =>
			entry.Country.forEach(country =>
				projectsByCountry.get(country)?.push(entry)
			)
		);

		return projectsByCountry;
	}

	get educationLevels() {
		return [
			...new Set(this.data.map(entry => entry['Level of Education']).flat())
		];
	}

	get skillsMeasured() {
		return [...new Set(this.data.map(entry => entry.Skills).flat())];
	}

	get challengeAreas() {
		return [...new Set(this.data.map(entry => entry))];
	}

	setSelectedCountry(country: string) {
		this.selectedCountry = country;
	}
	setEducationLevel(level: string) {
		this.selectedEducationLevel = level;
	}
	setSkillsMeasured(skill: string) {
		this.selectedSkill = skill;
	}
}

export const stateProvider = observable.box<State | undefined>();
