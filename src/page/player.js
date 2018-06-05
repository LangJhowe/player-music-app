import React, { Component } from 'react';
import $ from "jquery";
import Progress from '../components/progress';
import './player.css';
import jPlayer from 'jplayer';
import { Link } from 'react-router-dom';
import Pubsub from 'pubsub-js';




let duration = null;
class Player extends Component {
    constructor(...args){
        super(...args);
        this.state = {
            progress:0,
            volume:0,
            isPlay:true,
            leftTime:0
        }
    }
    playPrev(){
        Pubsub.publish('PLAY_PREV');
    };
    playNext(){
        Pubsub.publish('PLAY_NEXT');
    };
    formatTime(time){
        time = Math.floor(time);
        let miniutes = Math.floor(time / 60);
        let seconds = Math.floor(time % 60);
        seconds = seconds < 10 ?  `0${seconds}` : seconds;
        return `${miniutes} : ${seconds}`;
    }
    componentDidMount(){
        $('#player').bind($.jPlayer.event.timeupdate, (e) => {    //绑定时间更新
            duration = e.jPlayer.status.duration;
            this.setState({
                volume:e.jPlayer.options.volume * 100,//触发setState方法设置progress
                progress:Math.round(e.jPlayer.status.currentPercentAbsolute),  //progress取值播放器的时间,可以绝对时间currentTime
                leftTime:this.formatTime(duration * (1 - e.jPlayer.status.currentPercentAbsolute / 100)),
            });
        });
    }
    componentWillUnmount(){
        $('#Player').unbind($.jPlayer.event.timeupdate)
    };
    progressChangeHandler(progress){
        $('#player').jPlayer('play',duration * progress);
    };
    changeVolumeHandler(progress){
        $('#player').jPlayer('volume',progress);
    }
    play(){
        if(this.state.isPlay){
            $('#player').jPlayer('pause');
        }else{
            $('#player').jPlayer('play');
        }
        this.setState({
            isPlay: !this.state.isPlay
        });
    }
    switchPlayMode(){
        Pubsub.publish('SWITCH_MODE');
    }
    render() {
        return (
            <div className='player-page'>
                <h1 className='caption'><Link to="/list">我的私人音乐坊 &gt;</Link></h1>
                <div className="mt20 row">
                    <div className="controll-wrapper">
                        <h2 className="music-title">{this.props.currentMusicItem.title}</h2>
                        <h3 className="music-artist mt10">{this.props.currentMusicItem.artist}</h3>
                        <div className="row mt20">
                            <div className="left-time -col-auto">-{this.state.leftTime}</div>
                            <div className="volume-container">
                                <i className="icon-volume rt" style={{top:5,left:-5}}></i>
                                <div className="volume-wrapper">
                                    <Progress
                                        progress={this.state.volume}
                                        onProgressChange={this.changeVolumeHandler}
                                        barColor="#aaa"
                                    >
                                    </Progress>
                                </div>
                            </div>
                        </div>
                        <div style={{height:10,lineHeight:'10px',marginTop:'10px'}}>
                            <Progress
                                progress={this.state.progress}
                                onProgressChange={this.progressChangeHandler}
                            >
                            </Progress>
                        </div>
                        <div className="mt35 row">
                            <div>
                                <i className="icon prev" onClick={this.playPrev}></i>
                                <i className={`icon ml20 ${this.state.isPlay ? 'pause' : 'play'}`} onClick={this.play.bind(this)}></i>
                                <i className="icon next ml20" onClick={this.playNext}></i>
                            </div>
                            <div className="-col-auto">
                                <i className={`icon ${this.props.currentPlayMode}`} onClick={this.switchPlayMode.bind(this)}></i>
                            </div>
                        </div>
                    </div>
                    <div className='-col-auto cover' >
                        <img className={`${Math.ceil(this.state.leftTime)>= Math.ceil(duration) ? 'pause' : this.state.isPlay ? '':'pause'}`} src={this.props.currentMusicItem.cover} alt={this.props.currentMusicItem.title}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Player;
