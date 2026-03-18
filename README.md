# YouTube Premium Experience


<img src="logo.svg" alt="Premium" width="200">

A simple browser extension that makes YouTube feel like Premium. Changes the logo and removes all ads.

---

## What it does

- Changes the regular YouTube logo to the Premium logo
- Blocks all ads (pre-roll, mid-roll, banners, everything)
- Uses AdGuard-style blocking rules at the network level
- Works on desktop and mobile YouTube

---

## Install

1. Open `chrome://extensions/`
2. Turn on Developer mode (top right)
3. Click Load unpacked
4. Select this folder

Done. You now have Premium-looking YouTube with no ads.

---

## How it works

Two things happen:

Logo replacement
The extension finds the YouTube logo on the page and swaps it with the Premium SVG.

Ad blocking
Uses Chrome's declarativeNetRequest API (the same tech AdGuard uses) to block ads before they load. Combined with CSS hiding and DOM removal, ads don't stand a chance.

---

## Files

```
manifest.json   - Extension config
background.js   - Service worker that registers blocking rules
content.js      - Logo replacement + ad removal
rules.json      - 30+ AdGuard-style blocking rules
logo.svg        - The Premium logo
```

---

## Legal stuff

This isn't affiliated with Google or YouTube. Just a personal project. Use at your own risk.

The YouTube name and logo are trademarks of Google LLC.

---

## License

MIT
