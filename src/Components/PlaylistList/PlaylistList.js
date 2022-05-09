import React from "react";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import "./PlaylistList.css";

class PlaylistList extends React.Component {

    constructor(props) {
        super(props);
        this.state = { playlists: [] }
    }

    mapItems() {
        if(this.props.items) {
            return this.props.items.map(item => {
                return <PlaylistItem key={item.id} id={item.id} name={item.name} selectPlaylist={this.props.selectPlaylist} />
            });
        }
    }

    render() {
        return (
            <div className="PlaylistList">
                <h2>Your Playlists</h2>
                <div className="PlaylistListContainer">
                    {this.mapItems()}
                </div>
                <div className="refresh-container">
                    <button className="Playlist-save" onClick={this.props.refresh}>REFRESH</button>

                </div>
            </div> 
        );
    }
}

export default PlaylistList;