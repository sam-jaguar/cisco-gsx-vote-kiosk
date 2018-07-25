const {app, BrowserWindow, ipcMain} = require('electron');
const { NFC } = require('nfc-pcsc');
const path = require('path');

let win;
let url = "";
const nfc = new NFC();

function createWindow () {
  win = new BrowserWindow({width: 337, height: 233,
    fullscreen: false
  })

  win.loadFile('src/index.html');
  win.setMenu(null);
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('updateUrl', (event, arg) => {
    url = arg;
});


nfc.on('reader', reader => {

    console.log(`${reader.reader.name}  device attached`);

    // needed for reading tags emulated with Android HCE
    // custom AID, change according to your Android for tag emulation
    // see https://developer.android.com/guide/topics/connectivity/nfc/hce.html
    reader.aid = 'F222222222';

    reader.on('card', async card => {

        // card is object containing following data
        // [always] String type: TAG_ISO_14443_3 (standard nfc tags like Mifare) or TAG_ISO_14443_4 (Android HCE and others)
        // [always] String standard: same as type
        // [only TAG_ISO_14443_3] String uid: tag uid
        // [only TAG_ISO_14443_4] Buffer data: raw data from select APDU response
        try {
          console.log(`${reader.reader.name}  card detected`, card);
          const data = await reader.read(0, 128);
          console.log("data read", data);

          const payload = data.toString();
          console.log("data converted", payload);

          var rawData = payload.split(String.fromCharCode(30))[1]
          var userData= rawData.split(String.fromCharCode(31)).filter(a=>a!="");
          console.log(userData);

          var badgeId = userData[0]
          var firstName = userData[1]
          var lastName = userData[2]

        } catch (err) {
          console.error("error reading data", error);
        }
    });

    reader.on('card.off', card => {
        console.log(`${reader.reader.name}  card removed`, card);
    });

    reader.on('error', err => {
        console.log(`${reader.reader.name}  an error occurred`, err);
    });

    reader.on('end', () => {
        console.log(`${reader.reader.name}  device removed`);
    });

});

nfc.on('error', err => {
    console.log('an error occurred', err);
});