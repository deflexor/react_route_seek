import express from 'express';
import validate from "validate.js";
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());


var order_constraints = {
    from_place:  {
        presence: true
    },
    to_place:  {
        presence: true
    },
    broker: {
        presence: true,
        numericality: {
            onlyInteger: true,
            greaterThan: 0
        }
    },
    code: {
        presence: true,
        format: /[a-z0-9]+/i
    },
    fix_total: {
        presence: true,
        numericality: true
    },
    start_date_up: {
        presence: true
    },
    start_date_down: {
        presence: true
    },
    end_date_up: {
        presence: true
    },
    end_date_down: {
        presence: true
    }
};

/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - style.css
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment
app.get('/app.js', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/app.js');
  } else {
    res.redirect('//localhost:9090/build/app.js');
  }
});

// Serve aggregate stylesheet depending on environment
app.get('/style.css', (req, res) => {
  if (process.env.PRODUCTION) {
    res.sendFile(__dirname + '/build/style.css');
  } else {
    res.redirect('//localhost:9090/build/style.css');
  }
});


// API
app.get('/api/:f.json', (req, res, next) => {
    if(/^[a-z]{1,20}$/i.test(req.params.f)) {
        res.sendFile(`${__dirname}/data/${req.params.f}.json`);
    }
    else {
        res.status(400).send({ error: 'Incorrect endpoint' });
    }
});

app.post('/api/orders.json', (req, res, next) => {
    //console.log(req.body);
    const errors = validate(req.body, order_constraints);
    if(errors) {
        res.status(400).send({ errors: errors });
    }
    else {
        res.status(200).send({ ok: 1 });
    }
});

// Serve index page
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
});


/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');
    const config = require('./webpack.local.config');

    new WebpackDevServer(webpack(config), {
        publicPath: config.output.publicPath,
        hot: true,
        noInfo: true,
        historyApiFallback: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    }).listen(9090, 'localhost', (err, result) => {
        if (err) {
            console.log(err);
        }
    });
}


/******************
 *
 * Express server
 *
 *****************/

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Essential React listening at http://%s:%s', host, port);
});
