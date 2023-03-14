import express from 'express';

import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';

dotenv.config();

// * Routes
import auth from './routes/auth';
import playing from './routes/playing';

const
    app = express(),
    { PORT } = process.env;

let jsonFolder = path.join(__dirname, '../json'),
    fileConfig = path.join(__dirname, '../json/configs.json');

if (!fs.existsSync(jsonFolder)) {
    fs.mkdir(jsonFolder, (err) => {
        if (err) throw err;

        console.log(`[Server]: Create folder json.`);
    });
}

if (!fs.existsSync(fileConfig)) {
    fs.writeFile(fileConfig, '[]', { encoding: 'utf-8' }, err => {
        if (err) throw err;

        console.log(`[Server]: Create file configs.json in folder json.`);
    });
}

app.use('/auth', auth);
app.use('/playing', playing);

const server = app.listen(PORT || 4000, () => {
    console.log(`[Server]: Server is running at http://localhost:${PORT || 4000}`);
});

