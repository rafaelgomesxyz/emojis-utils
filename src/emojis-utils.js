import emojis from './emojis.json';

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
		root.emojiUtils = factory();
	}
};

const factory = () => {
	/**
	 * @param {string} shortName
	 * @returns {import('./emojis-utils').Emoji | undefined}
	 */
	const getEmoji = (shortName) => {
		return emojis.find((emojiToCompare) => emojiToCompare.short_name === shortName);
	};

	/**
	 * @param {string} emoji
	 * @returns {string | undefined}
	 */
	const getEmojiShortName = (emoji) => {
		const foundEmoji = emojis.find((emojiToCompare) => emojiToCompare.emoji === emoji);
		return foundEmoji && foundEmoji.short_name;
	};

	/**
	 * @param {string} emoji
	 * @returns {string[]}
	 */
	const getEmojiEntities = (emoji) => {
		return [...emoji].map((char) => {
			const codePoint = char.codePointAt(0);
			return codePoint ? `&#x${codePoint.toString(16)}` : '';
		});
	};

	return {
		emojis,
		getEmoji,
		getEmojiShortName,
		getEmojiEntities,
	};
};

umd(typeof self === 'undefined' ? this : self, factory);
