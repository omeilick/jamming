import React from "react";

import "./Tracklist.css";

import Track from '../Track/Track';

class Tracklist extends React.Component {
    mapTracks() {
        if(this.props.tracks) {
            return this.props.tracks.map(track => {
                    return <Track   track={track} 
                                    key={track.id} 
                                    onAdd={this.props.onAdd} 
                                    onRemove={this.props.onRemove} 
                                    isRemoval={this.props.isRemoval} />
                });
            }
        }
    

    render() {
        return (
            <div class="TrackList">
                {this.mapTracks()}
            </div>
        )
    }
}

export default Tracklist;

