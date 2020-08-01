// Type definitions for emojis-utils 1.0.0
// Project: https://gitlab.com/rafaelgssa/emojis-utils
// Definitions by: Rafael Gomes <rafael.gssa@pm.me> (https://gitlab.com/rafaelgssa>)

export as namespace emojiUtils;

export interface Emoji {
	codes: string[];
	name: string;
	short_name: string;
	emoji: string;
}

export const emojis: Emoji[];
export function getEmoji(shortName: string): Emoji | undefined;
export function getEmojiShortName(emoji: string): string | undefined;
export function getEmojiEntities(emoji: string): string[];
