'use strict';

import React, {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'

import FriendsTab from './layout/Friends'
import ChannelsTab from './layout/Channels'
import TabView from './layout/TabView'
import Splash from './layout/Splash'
import Login from './layout/Login'
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

class App extends React.Component {
  render() {
    return (
      <Router hideNavBar={true} name="root">
        <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
        <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name="withoutAnimation"/>
        <Schema name="tab" type="switch" icon={TabIcon} />
        <Route name="login" component={Login} title="Login"/>
        <Route name="tabbar">
          <Router footer={TabBar} showNavigationBar={false} tabBarStyle={{borderTopColor:'#00bb00',borderTopWidth:1,backgroundColor:'white'}}>
            <Route name="friendsTab" schema="tab" title="Friends"  >
              <Router>
                <Route name="Friends" component={FriendsTab} title="Friends" />
              </Router>
            </Route>
            <Route name="channelTab" schema="tab" title="Channels"  >
              <Router>
                <Route name="Channels" component={ChannelsTab} title="Channels" />
              </Router>
            </Route>
          </Router>
        </Route>
        <Route name="chat" component={Chat} title="Chat" />
        <Route name="splash" component={Splash} initial={true} wrapRouter={true} title="Splash"/>
      </Router>
    );
  }
}

module.exports = App