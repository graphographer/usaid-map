import { makeAutoObservable, observable } from 'mobx';
import { TDataEntries, TDataEntry } from './types';
import { CHALLENGE_AREAS } from './challenge_areas';
import { entries } from 'lodash';

export class State {
	data: TDataEntries;

	selectedCountry: string = 'Brazil';
	selectedChallengeArea: string = '';
	selectedEducationLevel: string = '';
	selectedSkill: string = '';

	constructor(data: TDataEntries) {
		this.data = data;

		makeAutoObservable(this, {
			data: false
		});
	}

	get selectedCountrySkills() {
		if (!this.selectedCountry) return [];

		return [
			...this.projectsByCountry
				.get(this.selectedCountry)
				.reduce((acc, project) => {
					project.Skills.forEach(skill => acc.add(skill));
					return acc;
				}, new Set())
		];
	}

	get allCountries() {
		return [...new Set(this.data.map(entry => entry.Country).flat())].sort();
	}
	get allSkills() {
		return [...new Set(this.data.map(entry => entry.Skills).flat())].sort();
	}

	get entriesByChallengeArea(): Map<string, TDataEntry[]> {
		const entriesByChallengeArea = new Map();

		for (const challenge in CHALLENGE_AREAS) {
			const preciseChallenges = CHALLENGE_AREAS[challenge].map(
				(challenge: string) => challenge.toLowerCase()
			);

			const entriesWithSelectedChallenges = this.data.filter(entry => {
				const entryChallenges = Object.entries(entry).filter(([key, val]) => {
					return (
						preciseChallenges.includes(key.toLowerCase()) &&
						!!val &&
						val !== '[NO RESPONSE]'
					);
				});

				return !!entryChallenges.length;
			});

			entriesByChallengeArea.set(challenge, entriesWithSelectedChallenges);
		}

		return entriesByChallengeArea;
	}

	get filteredCountries(): Set<string> {
		const { selectedEducationLevel, selectedSkill, selectedChallengeArea } =
			this;

		if (!selectedEducationLevel && !selectedSkill && !selectedChallengeArea) {
			return new Set();
		}

		let filteredEntries: TDataEntry[] = [...this.data];
		if (selectedEducationLevel) {
			filteredEntries = filteredEntries.filter(entry => {
				return entry['Level of Education'].includes(selectedEducationLevel);
			});
		}
		if (selectedSkill) {
			filteredEntries = filteredEntries.filter(entry => {
				return entry.Skills.includes(selectedSkill);
			});
		}
		if (selectedChallengeArea) {
			filteredEntries = filteredEntries.filter(entry => {
				return this.entriesByChallengeArea
					.get(selectedChallengeArea)
					.includes(entry);
			});
		}

		return new Set(filteredEntries.map(entry => entry.Country).flat());
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

	get selectedCountryProjects() {
		if (!this.selectedCountry) return [];

		return this.projectsByCountry.get(this.selectedCountry);
	}

	get selectedCountryEducationLevels() {
		if (!this.selectedCountry) return [];

		return [
			...new Set(
				this.selectedCountryProjects
					.map(project => project['Level of Education'])
					.flat()
			)
		];
	}

	get challengeAreas() {
		return [
			'Local Engagement of Stakeholders',
			'Identifying Purpose of Measurement and Linking to Assessment',
			'General Issues Related to Measurement',
			'Socialization and Buy-In Around SEL/SS Measurement',
			'Other'
		];
	}

	setSelectedCountry(country: string) {
		this.selectedCountry = country;
	}
	setChallengeArea(challenge: string) {
		this.selectedChallengeArea = challenge;
	}
	setEducationLevel(level: string) {
		this.selectedEducationLevel = level;
	}
	setSkillsMeasured(skill: string) {
		this.selectedSkill = skill;
	}
}

export const stateProvider = observable.box<State | undefined>();
