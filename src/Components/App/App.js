import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PlaylistList from '../PlaylistList/PlaylistList';
import Tracklist from '../Tracklist/Tracklist';
import './App.css';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      playlistID: null,
      playlistName: 'My Playlist',
      playlistTracks: [],
      playlists: [],
    };
    this.getUserPlaylists = this.getUserPlaylists.bind(this);
    this.addTrack = this.addTrack.bind(this); 
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.saveNewPlaylist = this.saveNewPlaylist.bind(this);
    this.clearPlaylist = this.clearPlaylist.bind(this)
    this.search = this.search.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  getUserPlaylists() {
    Spotify.getUserPlaylists().then(playlists => this.setState({ playlists: playlists }));   
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks })
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({ playlistTracks: tracks });
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    if (!trackURIs || !trackURIs.length) {
      alert("Your playlist is empty! Please add tracks.");
    } else {
      Spotify.savePlayList(this.state.playlistName, trackURIs, this.state.playlistID).then(() => {
        this.clearPlaylist(); 
        Spotify.getUserPlaylists().then(playlists => this.setState({ playlists: playlists }))
      }
    )}
  }

  saveNewPlaylist() {
    this.setState({playlistID: null}, () => this.savePlaylist());
  }

  clearPlaylist() {
    this.setState({ playlistID: null, playlistName: 'New Playlist', playlistTracks: [] })
  }

  async search(term) {
    if (term !== "") {
      const searchResults = await Spotify.search(term);
      this.setState({ searchResults: searchResults });
    } else {
      alert("Please add a Song, Artist, or Album")
    }
  }

  selectPlaylist(id) {
    Spotify.getPlaylist(id).then(response => {
      const playlistTracks =  response.tracks.items.map(item => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri
      }));
      this.setState({ playlistID: id, playlistName: response.name, playlistTracks: playlistTracks })
    })
  }

  // Automatically Mounts Component 
      //Completley uneccessary and asks the user to login because 
      //this fuction grabs the user's playlists when opening
  //componentDidMount() {
  //    this.getUserPlaylists();
  //  }

  

  render() {


    return (
      <div>
          <h1>
            Ja<span className="highlight">mmm</span>ing
          </h1>

        <div className="App">
          <SearchBar onSearch={this.search} />
         <div className="App-playlist">
          <SearchResults 
                    searchResults={this.state.searchResults} 
                    onSearch={this.search}
                    onAdd={this.addTrack}/> 
          <Playlist playlistName={this.state.playlistName}
                    playlistTracks={this.state.playlistTracks} 
                    onRemove={this.removeTrack} 
                    onNameChange={this.updatePlaylistName} 
                    onClear={this.clearPlaylist} 
                    onSave={this.savePlaylist} 
                    onSaveNew={this.saveNewPlaylist} />
      </div>
          <PlaylistList items={this.state.playlists} 
                        selectPlaylist={this.selectPlaylist} 
                        refresh={this.getUserPlaylists} />
      </div>
    </div>
    )
  }
}


export default App;
