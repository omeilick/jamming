import React from "react";
import './PlaylistItem.css';

class PlaylistItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick =  this.handleClick.bind(this);
    }

    handleClick() {
        this.props.selectPlaylist(this.props.id);
    }

    render() {
        return (
        <div className="Item" onClick={this.handleClick}>
            <div className="Item-info">
                <h3 name={this.props.name}>{this.props.name}</h3>
            </div>   
        </div>
        );
    }
}

export default PlaylistItem;