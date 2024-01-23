import { groupBy, pickBy } from 'lodash';
import { makeAutoObservable, observable } from 'mobx';
import { CHALLENGE_AREAS, PRECISE_CHALLENGE_AREAS } from './challenge_areas';
import { TDataEntries, TDataEntry } from './types';
import { EDUCATION_LEVELS } from './education_levels';
import { ASSESSMENT_TYPES } from './assessment_types';

export class State {
	data: TDataEntries;

	selectedCountry: string = '';
	selectedChallengeArea: string = '';
	selectedEducationLevel: string = '';
	selectedSkill: string = '';

	constructor(data: TDataEntries) {
		this.data = data;

		makeAutoObservable(this, {
			data: false
		});
	}

	static perCountryRegex = new RegExp(/^In\s(.*):$/gm);
	get selectedCountrySkills(): string[] {
		if (!this.selectedCountry) return [];

		return [
			...this.projectsByCountry
				.get(this.selectedCountry)
				.reduce<Set<string>>((acc, project) => {
					let skills = project['Common Skills'];
					const hasCountries = skills.find(skill =>
						skill.match(State.perCountryRegex)
					);

					if (hasCountries) {
						const perCountry: Record<string, string[]> = skills
							.map<[string, number] | undefined>((skill, i) => {
								const match = skill.matchAll(State.perCountryRegex);
								if (match) {
									const matchArray = [...match];

									if (!matchArray.length) return;

									const country = matchArray[0][1];

									return [country, i + 1];
								} else return;
							})
							.filter(Boolean)
							.reduce((acc, [country, startIndex], i, list) => {
								acc[country] = skills.slice(
									startIndex,
									i < list.length - 1 ? list[i + 1][1] - 1 : undefined
								);
								return acc;
							}, {});

						skills = perCountry[this.selectedCountry];
					}

					project['Common Skills'].forEach(skill => acc.add(skill));

					return acc;
				}, new Set())
		];
	}

	get assessmentTypesByProject(): Map<TDataEntry, string[]> {
		return new Map(
			this.data.map(project => {
				const assessmentTypes = ASSESSMENT_TYPES.filter(
					([type]) => project[type] === '1'
				);

				return [project, assessmentTypes.map(([, val]) => val)];
			})
		);
	}

	get allCountries() {
		return [
			...new Set(
				this.data
					.map(entry => entry.Country.filter(country => country !== 'Globally'))
					.flat()
			)
		].sort();
	}
	get allSkills() {
		return [...new Set(this.data.map(entry => entry['Common Skills']).flat())]
			.filter(skill => !skill.match(State.perCountryRegex))
			.sort();
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

	get challengesByProject(): Map<
		TDataEntry,
		Record<string, [string, string][]>
	> {
		return new Map(
			this.data.map(project => {
				const preciseChallenges = pickBy(project, (val, key) =>
					PRECISE_CHALLENGE_AREAS.map(challenge =>
						challenge.toLowerCase()
					).includes(key.toLowerCase())
				);

				const groupedChallenges = groupBy(
					Object.entries(preciseChallenges),
					([preciseChallenge, response]) => {
						const broad = Object.entries(CHALLENGE_AREAS).find(
							([broad, precise]) =>
								precise
									.map(challenge => challenge.toLowerCase())
									.includes(preciseChallenge.toLowerCase())
						);

						return broad?.[0];
					}
				) as Record<string, [string, string][]>;

				return [project, groupedChallenges];
			})
		);
	}

	get filteredCountries(): Set<string> {
		const { selectedEducationLevel, selectedSkill, selectedChallengeArea } =
			this;

		if (!this.isFiltered) {
			return new Set(this.allCountries);
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
		return EDUCATION_LEVELS;
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

	get isFiltered() {
		return (
			this.selectedChallengeArea ||
			this.selectedEducationLevel ||
			this.selectedChallengeArea
		);
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
