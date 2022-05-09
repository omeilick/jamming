import React from "react";
import "./Playlist.css";
import TrackList from '../Tracklist/Tracklist';

class Playlist extends React.Component {

    constructor(props) {
        super(props);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(event) {
        this.props.onNameChange(event.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                <input value={this.props.playlistName}
                        onChange={this.handleNameChange}/>
                <TrackList  tracks={this.props.playlistTracks}
                            onRemove={this.props.onRemove}
                            isRemoval={true}/>
                <div className="playlist-buttons">
                    <button className="Playlist-save" onClick={this.props.onClear}>CLEAR</button>
                    <button className="Playlist-save" onClick={this.props.onSave}>SAVE</button><button className="Playlist-save" onClick={this.props.onSaveNew}>SAVE AS NEW</button>
                </div>
            </div>
        );
    }
}

export default Playlist;
