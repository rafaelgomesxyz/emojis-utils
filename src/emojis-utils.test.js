const emojisUtils = require('./emojis-utils');

describe('emojisUtils', () => {
	describe('#emojis', () => {
		test('do not have duplicate short names', () => {
			const duplicates = emojisUtils.emojis.filter((emoji, i) =>
				emojisUtils.emojis
					.slice(i + 1)
					.find((emojiToCompare) => emojiToCompare.short_name === emoji.short_name)
			);
			expect(duplicates).toHaveLength(0);
		});
	});

	describe('#getEmoji()', () => {
		test('return correct emoji', () => {
			const emoji = emojisUtils.getEmoji('smile');
			expect(emoji).toEqual('😄');
		});
	});

	describe('#getShortName()', () => {
		test('return correct short name', () => {
			const shortName = emojisUtils.getShortName('😄');
			expect(shortName).toEqual('smile');
		});
	});

	describe('#getEntities()', () => {
		test('return correct entities', () => {
			const entities = emojisUtils.getEntities('😄');
			expect(entities).toEqual(['&#x1f604']);
		});
	});
});
