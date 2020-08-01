const emojis = require('./emojis.json');

/* globals define */

/**
 * @param {*} root
 * @param {*} factory
 */
const umd = (root, factory) => {
	// @ts-expect-error
	if (typeof define === 'function' && define.amd) {
		// @ts-expect-error
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.emojisUtils = factory();
	}
};

const factory = () => {
	/**
	 * @param {string} shortName
	 * @returns {string | undefined}
	 */
	const getEmoji = (shortName) => {
		const foundEmoji = emojis.find((emojiToCompare) => emojiToCompare.short_name === shortName);
		return foundEmoji && foundEmoji.emoji;
	};

	/**
	 * @param {string} emoji
	 * @returns {string | undefined}
	 */
	const getShortName = (emoji) => {
		const foundEmoji = emojis.find((emojiToCompare) => emojiToCompare.emoji === emoji);
		return foundEmoji && foundEmoji.short_name;
	};

	/**
	 * @param {string} emoji
	 * @returns {string[]}
	 */
	const getEntities = (emoji) => {
		return [...emoji].map((char) => {
			const codePoint = char.codePointAt(0);
			return codePoint ? `&#x${codePoint.toString(16)}` : '';
		});
	};

	return {
		emojis,
		getEmoji,
		getShortName,
		getEntities,
	};
};

umd(typeof self === 'undefined' ? this : self, factory);
