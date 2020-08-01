const emojis = require('./emojis.json');

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

module.exports = {
	emojis,
	getEmoji,
	getShortName,
	getEntities,
};
