## Electron app for running the badge scan kiosks.

go get node (should come with NPM) for your system.

If you're running this on Ubuntu, do this first:
`apt-get install libpcsclite1 libpcsclite-dev pcscd`

If you're on windows or mac, the PCSC drivers should work out of the box (should).

do an `npm install` then `npm start` and it should just work.

check `app.js` for the backend stuff, check the `index` files for the frontend. Electron is too easy.

## TODO:

- send a POST to the specified URL on scan
- pass full name to frontend on scan
- update frontend visuals on scan
- report what happens when vote status comes back