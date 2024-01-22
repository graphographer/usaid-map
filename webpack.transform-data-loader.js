const { pickBy } = require('lodash');

const REQUIRED_COLUMNS = [
	// 'Name',
	// 'Email',
	'Organization',
	'Project/Program/Initiative Name',
	// 'Project Link',
	// 'Tool Link',
	'URL Tool Used or Adapted',
	'Project/Program/Initiative Description',
	'Country',
	'Level of Education',
	'Setting',
	'Common Skills',
	'Skills',
	// 'Currently Using an SEL/SS Measurement Tool',
	'Tool Used or Adapted',
	'Purpose of SEL/SS Measurement Tool',
	'Identifying a Clear Process for Contextualization of Tools',
	'Developing Local Capacity',
	'Balancing Local and Regional Differences (e.g., in language, values, education levels, etc.) in SEL/SS Measurement',
	'SEL/SS Measurement Tools that Match the Purpose',
	'Developing and/or Validating Measures for High-Stakes Assessments',
	'Identifying Valid and Reliable Tools for Local Context',
	'Finding Tools to Establish Evidence of Impact',
	'Navigating a Narrow Definition of Validity',
	'Developing Tools that Assess Competencies and Environment',
	'Limited Guidance on Assessing Environment to Aid in Interpretation',
	'Achieving a System-wide Adoption and Community-based Advocacy',
	'Getting Country and MOE to Prioritize SEL/SS',
	'Limited Coordination Efforts to Address SEL/SS Measurement',
	'Lack of a Concrete/Common Language',
	'Finding Donors',
	'Other'
	// 'Response to Member Check'
];

module.exports = data => {
	const parsed = JSON.parse(data.slice(17));

	const cleansed = parsed.map(program => {
		return pickBy(program, (val, key) => REQUIRED_COLUMNS.includes(key));
	});

	return `module.exports = ${JSON.stringify(cleansed)}`;
};
