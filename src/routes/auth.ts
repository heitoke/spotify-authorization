import { Router, type Response } from 'express';

import fs from 'fs';
import path from 'path';

import { spotifyApi, createAuthorizeURL } from '../libs/spotify';

const router: Router = Router();

let fileConfigs = path.join(__dirname, '../../json/configs.json');

function error(res: Response, err: unknown) {
    console.error(`[Server ERROR]:\n`, err);

    res.status(501).json({
        error: true,
        message: JSON.stringify(err)
    });
}

router.get('/', async (req, res) => {
    try {
        let url = createAuthorizeURL();

        res.redirect(url);
    } catch (err) {
        error(res, err);
    }
});

router.get('/callback', async (req, res) => {
    let { code } = req.query;

    if (!code) return res.status(401).json({ message: `No field - code` });

    try {
        let { body } = await spotifyApi.authorizationCodeGrant(code as string);

        spotifyApi.setAccessToken(body.access_token);

        let me = await spotifyApi.getMe();
    
        let configs = JSON.parse(fs.readFileSync(fileConfigs, { encoding: 'utf-8' })),
            data = configs.filter((c: any) => c.userId !== me.body.id);

        fs.writeFileSync(fileConfigs, JSON.stringify([...data || [], {
            userId: me.body.id,
            accessToken: body.access_token,
            refreshToken: body.refresh_token,
            scope: body.scope
        }], null, 4));

        res.status(200).json(me.body);
    } catch (err) {
        return error(res, err);
    }
});

export default router;