import React, { Component } from 'react';
import Header from './view/header/header';
import Player from './page/player';
import '../src/static/css/reset.css'
import '../src/static/css/common.css'
import $ from 'jquery';
import { MUSIC_LIST} from "./config/musiclist";
import MusicList from './page/musiclist';

import {  HashRouter as Router, Route ,Switch} from 'react-router-dom';

import Pubsub from 'pubsub-js';


class App extends Component {
  constructor(...args){
      super(...args);
      this.state={
          musicList:MUSIC_LIST,
          currentMusicItem:MUSIC_LIST[0],
          mode:['repeat-cycle','repeat-once',"repeat-random"],
          currentMode:'repeat-cycle'
      }
  };
  playMusic(musicItem){
      $('#player').jPlayer('setMedia',{
          mp3:musicItem.file
      }).jPlayer('play');
      this.setState({
          currentMusicItem: musicItem
      });
  };
  playNext(type = 'next'){
      let index = this.findMusicIndex(this.state.currentMusicItem);
      let newIndex = null;
      let musicListLength = this.state.musicList.length;
      if(type === 'next'){
          newIndex = (index + 1) % musicListLength;
      }else if(type === 'prev'){
          newIndex = (index - 1 + musicListLength) % musicListLength;
      }
      this.playMusic(this.state.musicList[newIndex]);
  }
  findMusicIndex(musicItem){
      return this.state.musicList.indexOf(musicItem);
  }
  switchMode(){
      let modeIdx = this.state.mode.indexOf(this.state.currentMode);
      let modeLength = this.state.mode.length;
      let nextModeIdx = (modeIdx + 1)% modeLength;
      this.setState({
          currentMode: this.state.mode[nextModeIdx]
      });
  }
  componentDidMount() {
      $('#player').jPlayer({
          supplied:'mp3',       //文件类型
          wmode:'window'
      });
      this.playMusic(this.state.currentMusicItem);
      $("#player").bind($.jPlayer.event.ended,(e) => {
          let musicListLength = this.state.musicList.length;
          if(this.state.currentMode === 'repeat-cycle'){
                this.playNext();
            }else if(this.state.currentMode === 'repeat-once'){
                this.playMusic(this.state.currentMusicItem);
            }else{
                this.playMusic(this.state.musicList[Math.floor(Math.random()*musicListLength)])
            }

      });
      Pubsub.subscribe('DELETE_MUSIC',(msg, musicItem) => {
            this.setState({
                musicList: this.state.musicList.filter(item => {
                    return item !== musicItem;
                })
            });
      });

      Pubsub.subscribe('PLAY_MUSIC',(msg,musicItem) => {
          this.playMusic(musicItem);
      });
      Pubsub.subscribe('PLAY_PREV',(msg,musicItem) => {
          this.playNext('prev');
      });

      Pubsub.subscribe('PLAY_NEXT',(msg,musicItem) => {
          this.playNext('next');
      });
      Pubsub.subscribe('SWITCH_MODE',(msg,musicItem) => {
          this.switchMode();
      });
  };

  componentWillUnmount(){
      Pubsub.unsubscribe('DELETE_MUSIC');
      Pubsub.unsubscribe('PLAY_MUSIC');
      Pubsub.unsubscribe('PLAY_PREV');
      Pubsub.unsubscribe('PLAY_MUSIC');
      Pubsub.unsubscribe('SWITCH_MODE');
      $("#player").unbind($.jPlayer.event.ended);
  };



  render() {
    return (                    //react-route v4 模式 和 传参数
        <div>
            <Header/>
            <Router>
                <Switch>
                    <Route exact path="/" render={(props) => (
                        <Player {...props}
                                currentMusicItem={this.state.currentMusicItem}
                                currentPlayMode={this.state.currentMode}
                        />
                    )}/>
                    <Route  path="/list" render={() => (
                        <MusicList
                                   currentMusicItem={this.state.currentMusicItem}
                                   musicList={this.state.musicList}
                        />
                    )}/>
                </Switch>
            </Router>
        </div>
    )}
}



export default App;


