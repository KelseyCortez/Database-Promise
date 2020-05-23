const express = require('express');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const config = {
    host: 'localhost',
    port: '5432',
    database: 'restaurant',
    user: 'postgres',
};
const db = pgp(config);


app.get('/api/restaurants', (req, res) => {
    db.query('SELECT * FROM restaurant')
        .then((results) => {
            res.json(results);
        });
});

app.get('/api/restaurants/:id', (req, res) => {
    db.oneOrNone('SELECT * FROM restaurant WHERE restaurant.id = $1',
        req.params.id
    )
        .then((result) => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({});
            }
        })
        .catch((e) => {
            res.status(500).json({
                error: 'Database Error',
            });
        });
});

app.post('/api/restaurants', (req, res) => {
    db.one('INSERT INTO restaurant VALUES (DEFAULT, ${name}, ${distance}, ${rating}, ${category}, ${fav_dish}, ${takeout}, ${last_visit})RETURNING *;',
        req.body
    ).then((result) => {
        res.status(201).json(result);
    });
});

app.delete('/api/restaurants/:id', (req, res)=> {
    db.oneOrNone('SELECT * FROM restaurant WHERE restaurant.id = $1', req.params.id
    ).then((result)=> {
        res.status(201).json(result);
    });
});


app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));