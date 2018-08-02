const {app, BrowserWindow, ipcMain} = require('electron');
const { NFC } = require('nfc-pcsc');
const path = require('path');
var http = require("http");
var https = require("https");

let win;
var url = "";
var port = 80;
var candidateId = "";
const nfc = new NFC();

function createWindow () {
  win = new BrowserWindow({width: 337, height: 233,
    fullscreen: true
  })

  win.loadFile('src/index.html');
  win.setMenu(null);
  win.openDevTools();
  // win.webContents.openDevTools();

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
ipcMain.on('updatePort', (event, arg) => {
    port = arg;
});
ipcMain.on('updateCandidateId', (event, arg) => {
    candidateId = arg;
});


nfc.on('reader', reader => {

  console.log(`${reader.reader.name}  device attached`);

  reader.on('card', async card => {
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

      win.webContents.send('badge-loading', {firstName: firstName, lastName: lastName})
      sendRequest(badgeId);

    } catch (err) {
      console.error("error reading data", err);
      win.webContents.send('badge-error', {body: "badge read error", status: "internal"})
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

var sendRequest = function(badgeid){
  var username = 'user';
  var password = 'secret';
  var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

  var options = {
    hostname: url,

    path: "/vote/"+candidateId+"?badge_id="+badgeid,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
    }
  };
  var req = https.request(options, function(res) {
    console.log('Status: ' + res.statusCode);
    console.log('Headers: ' + JSON.stringify(res.headers));
    res.setEncoding('utf8');
    res.on('data', function (body) {
      if(res.statusCode == 200 || res.statusCode == 409){
        win.webContents.send('badge-success', {body: body, status: res.statusCode});
      }else{
        win.webContents.send('badge-error', {body: body, status: res.statusCode});
      }
      console.log('Body: ' + body);
    });
  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
    win.webContents.send('badge-error', {body: e.message, status: 'internal'});
  });
  req.end();
}