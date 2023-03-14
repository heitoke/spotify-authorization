import { Router } from 'express';

import fs from 'fs';
import path from 'path';

import { spotifyApi } from '../libs/spotify';

const router: Router = Router();

let fileConfigs = path.join(__dirname, '../../json/configs.json');

router.get('/:userId', async (req, res) => {
    let { userId } = req.params;

    try {
        let configs = JSON.parse(fs.readFileSync(fileConfigs, { encoding: 'utf-8' }));

        let user = configs.find((c: any) => c.userId === userId);

        if (!user) return res.status(404).json({ message: 'no user' });

        spotifyApi.setAccessToken(user.accessToken);

        let { body } = await spotifyApi.getMyCurrentPlayingTrack();
        
        if (!body?.is_playing) return res.status(200).json({
            isPlaying: false,
            message: `The user ${user.userId} is not listening to anything at the moment`
        });
        
        return res.status(200).json(body);
    } catch (err) {
        return res.status(501).json({ message: err });
    }
});

export default router;