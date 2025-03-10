require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Our routes go here:
app.get('/', async (req, res) => {
  res.render('home', { title: 'home' });
});

//iteration 2
app.get('/artist-search', async (req, res) => {
  spotifyApi
    .searchArtists(req.query.name)
    .then((data) => {
      res.render('artists', { artists: data.body.artists.items });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

//iteration 3
app.get('/albums/:artistId', async (req, res) => {
  await spotifyApi.getArtistAlbums(req.params.artistId).then((data) => {
    res.render('albums', { albums: data.body.items });
    // res.send(data.body.items);
  }),
    function (err) {
      console.error(err);
    };
});

//iteration 5
app.get('/album/:albumId/tracks', async (req, res, next) => {
  try {
    const data = await spotifyApi.getAlbumTracks(req.params.albumId);
    // res.send(data);
    res.render('tracks', { tracks: data.body.items });
  } catch (error) {
    next(error);
  }
});

app.listen(3000, () =>
  console.log('My Spotify project running on http://localhost:3000 🎧 🥁 🎸 🔊')
);
