const { writeFileSync } = require('fs');
const fetch = require('node-fetch').default;
const { resolve } = require('path');

const EMOJIS_PATH = resolve(__dirname, '../src/emojis.json');

/** @type {Record<string, string | undefined>} */
let emojisShortNames;

/**
 * @returns {Promise<void>}
 */
const updateEmojis = async () => {
	try {
		const emojisArrays = await Promise.all([
			getUnicodeEmojis('https://unicode.org/emoji/charts/full-emoji-list.html'),
			getUnicodeEmojis('https://unicode.org/emoji/charts/full-emoji-modifiers.html'),
			getJapaneseEmojis(),
		]);
		const emojis = fixDuplicateShortNames(emojisArrays.flat());
		const emojisStr = JSON.stringify(emojis, null, 2);
		writeFileSync(EMOJIS_PATH, emojisStr);
		console.log('Emojis updated!');
	} catch (err) {
		console.log('Failed to update emojis!', err);
	}
};

/**
 * @param {string} url
 * @returns {Promise<import('../src/emojis-utils').Emoji[]>}
 */
const getUnicodeEmojis = async (url) => {
	console.log(`Retrieving unicode emojis for ${url}...`);
	/** @type {import('../src/emojis-utils').Emoji[]} */
	const emojis = [];
	const regExp = /<td\sclass='code'><a\shref='#.+?'\sname='(.+?)'>.+?<\/a><\/td>[\S\s]+?<td\sclass='name'>(.+?)<\/td>/g;
	const response = await fetch(url);
	const responseText = await response.text();
	let matches;
	while ((matches = regExp.exec(responseText)) !== null) {
		const codes = matches[1].toLowerCase().split('_');
		const name = capitalizeWords(matches[2].toLowerCase().replace('⊛ ', ''));
		const short_name = '';
		const emoji = getEmoji(codes);
		emojis.push({ codes, name, short_name, emoji });
	}
	const emojisWithShortNames = await getEmojisShortNames(emojis);
	console.log(`Successfully retrieved unicode emojis for ${url}!`);
	return emojisWithShortNames;
};

/**
 * @returns {Promise<import('../src/emojis-utils').Emoji[]>}
 */
const getJapaneseEmojis = async () => {
	console.log('Retrieving Japanese emojis...');
	const regExp = /JSON\.parse\('(.+?)'\)\},/;
	const url = 'https://www.jemoticons.com/_nuxt/pages/[_]lang/_cat.dc82455.js';
	const response = await fetch(url);
	const responseText = await response.text();
	const matches = regExp.exec(responseText);
	if (!matches) {
		return [];
	}
	/** @type {import('../src/emojis-utils').Emoji[]} */
	const emojis = [];
	const jpEmojisStr = matches[1]
		.replace(/\\'/g, "'")
		.replace(/\\\\"/g, '\\"')
		.replace(/\\\\\\"/g, '\\\\"');
	const jpEmojis = JSON.parse(jpEmojisStr);
	for (const [key, jpEmojisList] of Object.entries(jpEmojis)) {
		for (const [i, emoji] of jpEmojisList.entries()) {
			const codes = getEmojiCodes(emoji);
			const name = capitalizeWords(key.toLowerCase());
			const short_name = getEmojiShortName(`jp_${key}${i > 0 ? `_${i}` : ''}`);
			emojis.push({ codes, name, short_name, emoji });
		}
	}
	console.log('Successfully retrieved Japanese emojis!');
	return emojis;
};

/**
 * @param {import('../src/emojis-utils').Emoji[]} emojis
 * @returns {Promise<import('../src/emojis-utils').Emoji[]>}
 */
const getEmojisShortNames = async (emojis) => {
	if (!emojisShortNames) {
		console.log('Retrieving short names for emojis...');
		const url = 'https://raw.githubusercontent.com/bonusly/gemojione/master/config/index.json';
		const response = await fetch(url);
		const responseJson = await response.json();
		emojisShortNames = Object.fromEntries(
			Object.values(responseJson).map((value) => [
				value.moji,
				value.shortname.toLowerCase().slice(1, -1),
			])
		);
		console.log('Successfully retrieved short names for emojis!');
	}
	return emojis.map((emoji) => ({
		codes: [...emoji.codes],
		name: emoji.name,
		short_name: emojisShortNames[emoji.emoji] || getEmojiShortName(emoji.name),
		emoji: emoji.emoji,
	}));
};

/**
 * @param {import('../src/emojis-utils').Emoji[]} emojis
 * @returns {import('../src/emojis-utils').Emoji[]}
 */
const fixDuplicateShortNames = (emojis) => {
	const emojisCopy = emojis.map((emoji) => ({
		codes: [...emoji.codes],
		name: emoji.name,
		short_name: emoji.short_name,
		emoji: emoji.emoji,
	}));
	return emojisCopy.map((emoji, i) => {
		const duplicateEmoji = emojisCopy
			.slice(i + 1)
			.find((emojiToCompare) => emojiToCompare.short_name === emoji.short_name);
		if (duplicateEmoji) {
			emoji.short_name = getEmojiShortName(emoji.name);
			if (emoji.short_name === duplicateEmoji.short_name) {
				duplicateEmoji.short_name = getEmojiShortName(duplicateEmoji.name);
			}
			if (emoji.short_name === duplicateEmoji.short_name) {
				emoji.short_name = `${emoji.short_name}_1`;
			}
		}
		return emoji;
	});
};

/**
 * @param {string[]} codes
 * @returns {string}
 */
const getEmoji = (codes) => {
	const codePoints = codes.map((code) => parseInt(code, 16));
	return String.fromCodePoint(...codePoints);
};

/**
 * @param {string} emoji
 * @returns {string[]}
 */
const getEmojiCodes = (emoji) => {
	return [...emoji].map((char) => {
		const codePoint = char.codePointAt(0);
		return codePoint ? codePoint.toString(16) : '';
	});
};

/**
 * @param {string} str
 * @returns {string}
 */
const getEmojiShortName = (str) => {
	return str.toLowerCase().replace(
		/[^\w]/g, // Matches any non-alphanumeric character, except for underscores.
		'_'
	);
};

/**
 * @param {string} str
 * @returns {string}
 */
const capitalizeWords = (str) => {
	return str.replace(
		/(^|[^a-z0-9])([a-z])/g, // Matches the first character of the word and any other character followed by a non-alphanumeric character.
		(...matches) => `${matches[1]}${matches[2].toUpperCase()}`
	);
};

updateEmojis();
