module.exports = {
	root: true,
	env: {
		node: true,
		es6: true,
		browser: true
	},
	extends: ['eslint:recommended'],
	parserOptions: {
		parser: 'babel-eslint',
		ecmaVersion: 2020,
		sourceType: 'module'
	},
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
	}
};
