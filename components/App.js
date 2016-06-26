'use strict';

import React, {Component} from 'react';
import {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Scene, Router, TabBar, Modal, Schema, Actions, Reducer} from 'react-native-router-flux'

import FriendsTab from './layout/Friends'
import ChannelsTab from './layout/Channels'
import TabView from './layout/TabView'
import Splash from './layout/Splash'
import Login from './layout/Login'
import Register from './layout/Register'
import Chat from './layout/Chat'


var XPush = require('./libs/xpush');
var xpush = new XPush('http://54.178.160.166:8000', 'messengerx', function (type, data){
  if(type === 'LOGOUT'){
    // TODO : implement this.
  }
}, false );

//xpush.enableDebug();

class TabIcon extends React.Component {
  render(){
    return (
        <Text style={{color: this.props.selected ? 'red' :'black'}}>{this.props.title}</Text>
    );
  }
}

const styles = StyleSheet.create({
    container: {flex:1, backgroundColor:"transparent",justifyContent: "center",
        alignItems: "center",}

});

const reducerCreate = params=>{
    const defaultReducer = Reducer(params);
    return (state, action)=>{
        return defaultReducer(state, action);
    }
};


class App extends Component {
  render() {
    return (
      <Router createReducer={reducerCreate} sceneStyle={{backgroundColor:'#FFFFFF'}}>
        <Scene key="modal" component={Modal} >
          <Scene key="root" hideNavBar={true}>
            <Scene key="login">
                <Scene key="loginModal" component={Login} title="Login" hideNavBar={true} />
                <Scene key="register" component={Register} title="Register" hideNavBar={false}/>
            </Scene>
            <Scene key="splash" component={Splash} initial={true} title="Splash" type="replace"/>

            <Scene key="tabbar" tabs={true} default="tab1" >
              <Scene key="friendsTab" title="Friends" initial={true} icon={TabIcon}  >
                <Scene key="Friends" component={FriendsTab} title="Friends" />
              </Scene>
              <Scene key="channelTab" title="Channels" initial={false} icon={TabIcon} >
                <Scene key="Channels" component={ChannelsTab} title="Channels" />
              </Scene>
            </Scene>

            <Scene key="chat" component={Chat} title="Chat" />
          </Scene>
        </Scene>
      </Router>
    );
  }
}

module.exports = App