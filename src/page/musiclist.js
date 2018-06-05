import React,{ Component } from 'react';
import MusicListItem from '../components/musiclistitem';



class MusicList extends Component {

    render() {
        let listEle = null;
        listEle = this.props.musicList.map((item) => {  //map循环
            return(
            <MusicListItem
                focus={item === this.props.currentMusicItem}
                key={item.id}
                musicItem={item}
            >
                {item.title}
            </MusicListItem>)        //key作用每次更新自己对照key是否相同
        });                             //无副作用函数处理，否则影响引用
        return (
            <ul>
                {listEle}
            </ul>
        );
    }
}
export default MusicList;