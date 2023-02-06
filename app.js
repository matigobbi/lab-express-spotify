require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const app = express();
const SpotifyWebApi = require('spotify-web-api-node');



app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: "5b578ca89d6d4598ad71f2cbda1cbc86",
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', function (req, res){
    res.render('index')}
    );

app.get("/artist-search", function (req, res){
  console.log(req.query)
  const queryString = req.query.search

  spotifyApi
  .searchArtists(queryString)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render("artist", {"artists" : data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
  const id = req.params.artistId  
  spotifyApi
  .getArtistAlbums(id)
  .then(function(data) {
      console.log('Artist albums', data.body.items);
      res.render("albums",{"albums": data.body.items})
    },
    function(err) {
      console.error(err);
    }
  );
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


