# emojis-utils

Utilities for emojis.

Contains the full list of Unicode v13.0 emojis available at https://unicode.org/emoji/charts/full-emoji-list.html and https://unicode.org/emoji/charts/full-emoji-modifiers.html, and also the full list of Japanese emojis available at https://www.jemoticons.com, combined in a single list with their respective Unicode codes, name and short name.

The short names for Unicode emojis are retrieved from https://raw.githubusercontent.com/bonusly/gemojione/master/config/index.json (replacing all non-alphanumeric characters with underscores). For Unicode emojis that are not available in that file, and for Japanese emojis, the short names are generated from the names of the emojis. A number is appended to duplicate short names. For more information about how everything is processed, check the [scripts/update-emojis.js](/scripts/update-emojis.js) file.

---

## How to use

### Node.js

```
npm install emojis-utils
```

```
const emojisUtils = require('emojis-utils');

emojisUtils.getEmoji('smile');
```

Using destructuring:

```
const { getEmoji } = require('emojis-utils');

getEmoji('smile');
```

Using ES6 import:

```
import emojisUtils from 'emojis-utils';

emojisUtils.getEmoji('smile');
```

Using TypeScript:

```
import * as emojisUtils from 'emojis-utils';

emojisUtils.getEmoji('smile');
```

### Browser

```
<script src="emojis-utils.min.js">
<script>
	emojisUtils.getEmoji('smile');
</script>
```

---

## Properties

### emojis: Emoji[]

Contains the full list of emojis. `Emoji` has the following interface:

```
interface Emoji {
	codes: string[];
	name: string;
	short_name: string;
	emoji: string;
}
```

**WARNING:** The order of the emojis is not guaranteed to remain the same.

## Methods

### getEmoji(shortName: string): string | undefined

Returns the emoji associated with a short name, if it exists.

```
emojisUtils.getEmoji('smile'); // 😄
```

### getShortName(emoji: string): string | undefined

Does the opposite of `getEmoji`.

```
emojisUtils.getShortName('😄'); // 'smile'
```

### getEntities(emoji: string): string[]

Returns an array containing the HTML entities of an emoji, in the format `&#x...`.

```
emojisUtils.getEntities('😄'); // '&#x1f604'
```
