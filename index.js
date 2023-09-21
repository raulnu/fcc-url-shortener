require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const e = require('express');
const app = express();
const urls = [];
let counter = 0;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST new url
app.post('/api/shorturl', function(req, res) {
  // check if url is valid
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!urlRegex.test(req.body.url)) {
    return res.json({ error: 'invalid url' });
  }
  counter ++;
  urls.push({ original_url: req.body.url, short_url: counter });
  res.json({ original_url: req.body.url, short_url: counter });
});

// GET short url send to original url
app.get('/api/shorturl/:short_url', function(req, res) {
  const shortUrl = req.params.short_url;
  const url = urls.find(url => url.short_url === Number(shortUrl));
  return res.redirect(url.original_url);
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
