const SpotifyWebApi = require('spotify-web-api-node');
const fs = require('fs');
const express = require('express');
const app = express();

let { Client, body } = require('./config.json');

const PORT = 8888;

const spotifyApi = new SpotifyWebApi({
    clientId: Client.id,
    clientSecret: Client.secret,
    redirectUri: 'http://localhost:8888/callback'
});

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];

const loadBody = params => fs.writeFileSync('./config.json', JSON.stringify({ Client, body: params }), { encoding: 'utf-8' });

const refreshAccessToken = async token => {
    if (!token) return { code: 400, message: 'invalid refreshToken' };

    spotifyApi.setRefreshToken(token);

    try {
        const { body } = await spotifyApi.refreshAccessToken()
        spotifyApi.setAccessToken(body.access_token);
        loadBody({ ...body, refresh_token: token });
        setInterval(() => refreshAccessToken(token), (body.expires_in * 1000) - 20000)
        return body;
    } catch (err) {
        return err;
    }
}

refreshAccessToken(body.refresh_token);

app.get('/login', (req, res) => {
    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', async (req, res, next) => {
    const { code } = req.query;

    try {
        const { body } = await spotifyApi.authorizationCodeGrant(code);
        console.log(body);
        res.json(body);
        loadBody(body)
    } catch (err) {
        next(err)
    }
});

app.get('/refresh', async (req, res, next) => {
    const { token } = req.query;
    refreshAccessToken(token || body.refresh_token)
})

app.get('/info', async (req, res) => {
    spotifyApi.getMyCurrentPlaybackState().then(data => {
        res.send(data.body);
    })
})

app.listen(PORT, () => {
    console.log(`Server up. Go to in http://localhost:${PORT}/login in your browser.`);
})