import React,{ Component } from 'react';
import './musiclistitem.less';
import Pubsub from 'pubsub-js'

class MusicListItem extends Component{
    constructor(...args){
        super(...args);
        this.state={

        }
    }
    playMusic(musicItem){
        Pubsub.publish('PLAY_MUSIC',musicItem);
    }
    deleteMusic(musicItem,e){
        e.stopPropagation();
        Pubsub.publish('DELETE_MUSIC',musicItem);

    }
    render(){
        let musicItem = this.props.musicItem;

        return(
            <li onClick={this.playMusic.bind(this,musicItem)} className={`components-listitem row ${this.props.focus ? 'focus' : ''}`}>
                <p><strong>{musicItem.title} - {musicItem.artist}</strong></p>
                <p onClick={this.deleteMusic.bind(this,musicItem)} className="-col-auto delete"></p>
            </li>
        );
    }

}

export default MusicListItem;