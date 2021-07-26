'use strict';

var stream = require('stream');
const fs = require('fs');
const path = require('path');
const url = require('url');
const {google} = require('googleapis');
var express = require('express');
var router = express.Router();
const youtube = google.youtube('v3');
const people = google.people('v1');

const scopes = [
        'https://www.googleapis.com/auth/youtube.readonly',
        'profile',
];

var yt;
var me;


const keyPath = path.join(__dirname, '../oauth2.keys.json');
let keys = {
    redirect_uris: ['']
};
if (fs.existsSync(keyPath)) {
    keys = require(keyPath).web;
}


const oauth2Client = new google.auth.OAuth2(
    keys.client_id,
    keys.client_secret,
    keys.redirect_uris[0]
);



google.options({
    auth: oauth2Client
});

function getYT(num, nextToken) {
    return youtube.subscriptions.list({
        part: 'snippet',
        mine: true,
        order: 'alphabetical',
        maxResults: num,
        pageToken: nextToken,
    });
}
const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}



router.get('/', function (req, res, next) {
    res.render('login');
});



router.get('/oauth2callback', async function (req, res, next) {
    const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;
    const {
        tokens
    } = await oauth2Client.getToken(qs.get('code'));
    oauth2Client.setCredentials(tokens);
    res.redirect('/dashboard');
});

// router.post('/oauth2callback', (req, res) => {
//     console.log(req.body);
// });


//TODO ADD MIDDLEWARE
router.get('/dashboard', async function (req, res, next) {
    // res.redirect('/download-data-as-json');
    me = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,photos',
    });
    yt = await getYT(25);
    
    res.render('dashboard', {
        yt: yt.data,
        me: me.data,
    });

});


router.get('/download-data-as-json', async (req, res) => {


    let data = await getYT(50);
    data = data.data;
    let sub = data.items;
    let token = data.nextPageToken;
    while (token) {
        let tmp = await getYT(50, token);
        sub = [...sub, ...tmp.data.items];
        token = tmp.data.nextPageToken;
    }
    // LMAO HARD TO UNDERSTAND RIGHT ? :V (ILL REFACTOR THIS CODE NEXT TIME :p)
    let filename = me.data.names;
    filename = filename[0].givenName;
    res.status(200)
        .attachment(`${filename}_list.json`)
        .send(JSON.stringify(sub));
    

});


router.get('/logout', (req, res) => {
    oauth2Client.revokeToken(oauth2Client.credentials.access_token);
    res.redirect('/');
});


router.get('/auth', function (req, res, next) {
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
    });
    res.redirect(authorizeUrl);
})

module.exports = router;