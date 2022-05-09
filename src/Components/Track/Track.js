import React from "react";

import "./Track.css";

class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }

    addTrack() {
        this.props.onAdd(this.props.track);
    }

    removeTrack() {
        this.props.onRemove(this.props.track);
    }

    renderAction() {
        if (this.props.isRemoval) {
            return <button className="Track-action" onClick={this.removeTrack}>-</button>
        } else {
            return <button className="Track-action" onClick={this.addTrack}>+</button>
        }
    }

    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <div className="Album-Artist-Container">
                    <p>{this.props.track.artists}</p>
                    <p className="space">|</p>
                    <p>{this.props.track.album}</p>    
                    </div>
                </div>
                {this.renderAction()}
            </div>
        )
    }
}

export default Track;