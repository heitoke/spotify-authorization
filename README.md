# Mini Chat

## Installation
```bash
git clone https://github.com/bobiclaki/spotify-authorization
cd spotify-authorization
npm i -tls
node .
```

## Config
```js
{
    "Client": {
        "id": ...,
        "secret": ...
    },
    "body": {
        "access_token": ...,
        "token_type": "Bearer",
        "expires_in": 3600,
        "refresh_token": ...
        "scope": ...,
    }
}
```