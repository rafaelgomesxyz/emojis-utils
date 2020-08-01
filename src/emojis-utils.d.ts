// Type definitions for emojis-utils 1.0.0
// Project: https://gitlab.com/rafaelgssa/emojis-utils
// Definitions by: Rafael Gomes <rafael.gssa@pm.me> (https://gitlab.com/rafaelgssa>)

export as namespace emojisUtils;

export interface Emoji {
	codes: string[];
	name: string;
	short_name: string;
	emoji: string;
}

export const emojis: Emoji[];
export function getEmoji(shortName: string): string | undefined;
export function getShortName(emoji: string): string | undefined;
export function getEntities(emoji: string): string[];
