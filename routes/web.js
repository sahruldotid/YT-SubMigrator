//CHAOTIC CODE LMAO,, I DONT HAVE MUCH TIME :( . MAYBE NEXT TIME ILL REFACTOR THIS 

'use strict';

var stream = require('stream');
const fs = require('fs');
const path = require('path');
const url = require('url');
const {google} = require('googleapis');
var express = require('express');
const { route } = require('../app');
var router = express.Router();
const youtube = google.youtube('v3');
const people = google.people('v1');


var yt;
var me;

const scopes = [
        'https://www.googleapis.com/auth/youtube',
        'profile',
];


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

function getYT(num, nextToken, rest) {
    return youtube.subscriptions.list({
        part: 'snippet',
        mine: true,
        order: 'alphabetical',
        maxResults: num,
        pageToken: nextToken,
    });
}

async function getAllYT() {
    let data = await getYT(50);
    data = data.data;
    let sub = data.items;
    let token = data.nextPageToken;
    while (token) {
        let tmp = await getYT(50, token);
        sub = [...sub, ...tmp.data.items];
        token = tmp.data.nextPageToken;
    }
    
    return sub;
}

function storeYT(channel_id){
    return youtube.subscriptions.insert({
        part: ['snippet'],
        resource: {
            snippet: {
                resourceId: {
                    kind: "youtube#channel",
                    channelId : channel_id,
                }
            }
        }
        
    });
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




//TODO ADD MIDDLEWARE
router.get('/dashboard', async function (req, res, next) {
    me = await people.people.get({
        resourceName: 'people/me',
        personFields: 'names,photos',
    }).catch(() => res.redirect('/auth'));
    yt = await getYT(25).catch(() => res.redirect('/auth'));
    
    res.render('dashboard', {
        yt: yt.data,
        me: me.data,
    });

});



router.post('/insert', async (req, res) => {
    let sub = await getAllYT();
    let channelNow = sub.map(element => {
        return element.snippet.resourceId.channelId
    })
    let importedData = JSON.parse(req.body.data);
    let newChannel = importedData.filter(x => !channelNow.includes(x));
    let msg = "nothing to migrate";
    if(newChannel){
        for (const [i, value] of newChannel.entries()) {
            if (!await storeYT(value)){
                break;
            }
            msg = `Successful migrating ${i+1} subscriptions`;
        }
    }
    res.status(200)
        .send(msg);
});


// Need to reduce what object properties are important to dump
router.get('/download-data-as-json', async (req, res) => {
    let sub = await getAllYT();
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