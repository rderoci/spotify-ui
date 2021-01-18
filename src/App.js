import React from 'react';
import { SpotifyApiContext } from 'react-spotify-api';
import Cookies from 'js-cookie';
import axios from 'axios';
 
import { SpotifyAuth, Scopes } from 'react-spotify-auth';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lastListenedTracks: []
    }
  }

  componentDidMount() {
    const token = Cookies.get('spotifyAuthToken');

    //e.preventDefault();
    
    axios.get('https://api.spotify.com/v1/me/player/recently-played',  
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    )
    .then(async (response) => {
      for (let i = 0; i < response.data.items.length; i++) {
        const trackItem = response.data.items[i];
        
        let arrTrackFeatures = {};
        await axios.get('https://api.spotify.com/v1/audio-features/'+trackItem.track.id,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
        )
        .then((resp) => {
          arrTrackFeatures = resp.data;
          console.log('arrTrackFeatures');
          console.log(arrTrackFeatures);
        })
        .catch(console.log);

        let arrArtist = [];
        for (let x = 0; x < trackItem.track.artists.length; x++) {
          const artist = trackItem.track.artists[x];
          arrArtist.push(artist.name);
        }
        this.setState({lastListenedTracks: [...this.state.lastListenedTracks, Object.assign({'id': trackItem.track.id, 'track': trackItem.track.name, 'album': trackItem.track.album.name, 'artists': arrArtist.join()}, arrTrackFeatures)]});
      }
      console.log(this.state);
    })
    .catch(console.log);

    let arrTrackIds = [];
        for (let i = 0; i < this.state.lastListenedTracks.length; i++) {
          const trackId = this.state.lastListenedTracks[i];
          arrTrackIds.push(trackId);
        }
    
  }

  render() {
    const token = Cookies.get('spotifyAuthToken');

    return (
      <div className='App'>
        {token ? (
          <SpotifyApiContext.Provider value={token}>
            {/* Your Spotify Code here */}
            <p>You are authorized with token: {token}</p>

            <table className='trackTable'>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Track Name</th>
                  <th>Album</th>
                  <th>Artists</th>
                  <th>duration_ms</th>
                  <th>danceability</th>
                  <th>energy</th>
                  <th>instrumentalness</th>
                  <th>liveness</th>
                  <th>loudness</th>
                  <th>speechiness</th>
                  <th>valence</th>
                  <th>mode</th>
                  <th>key</th>
                  <th>tempo</th>
                  <th>time_signature</th>
                </tr>
              </thead>
              <tbody>
                {this.state.lastListenedTracks.map(row => {
                  return (
                    <tr>
                      <td>{row.id}</td>
                      <td>{row.track}</td>
                      <td>{row.album}</td>
                      <td>{row.artists}</td>
                      <td>{row.duration_ms}</td>
                      <td>{row.danceability}</td>
                      <td>{row.energy}</td>
                      <td>{row.instrumentalness}</td>
                      <td>{row.liveness}</td>
                      <td>{row.loudness}</td>
                      <td>{row.speechiness}</td>
                      <td>{row.valence}</td>
                      <td>{row.mode}</td>
                      <td>{row.key}</td>
                      <td>{row.tempo}</td>
                      <td>{row.time_signature}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

          </SpotifyApiContext.Provider>

        ) : (
          // Display the login page
          <SpotifyAuth
            redirectUri='http://localhost:3000/'
            clientID='1afb987c9a2940ff92152b68c2efde7f'
            scopes={[Scopes.userReadRecentlyPlayed]} // either style will work
          />
        )}
      </div>
    )
  }
}

export default App;
