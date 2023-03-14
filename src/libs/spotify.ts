import SpotifyWebApi from 'spotify-web-api-node';

import dotenv from 'dotenv';

dotenv.config();

let { CLIENT_ID, CLIENT_SECRET, CLIENT_REDIRECT_URI } = process.env;

export const scopes: string[] = [
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

export const spotifyApi = new SpotifyWebApi({
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: CLIENT_REDIRECT_URI
});

export function createAuthorizeURL(listScopes: string[] = scopes) {
    return spotifyApi.createAuthorizeURL(listScopes, 'code')
}