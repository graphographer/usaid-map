const ARRAY_COLUMNS = [
	'country',
	'level of education',
	'setting',
	'skills',
	'common skills'
];

module.exports = {
	csvRule: {
		test: /\.csv$/,
		loader: 'csv-loader',
		options: {
			header: true,
			skipFirstNLines: 3,
			skipEmptyLines: 'greedy',
			transformHeader(header) {
				return header.trim();
			},
			transform(data, header) {
				if (ARRAY_COLUMNS.includes(header.toLowerCase())) {
					const array = [
						...new Set(
							data
								.split('\n')
								.map(val => {
									return val.trim();
								})
								.filter(Boolean)
						)
					];

					// flatten capitalization
					if (header.toLowerCase() !== 'country') {
						return array.map(val => {
							const [first, ...rest] = val;
							return `${first.toUpperCase()}${rest.join('')}`;
						});
					} else {
						return array;
					}
				}

				return data.trim();
			}
		}
	}
};
