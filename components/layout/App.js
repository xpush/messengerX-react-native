'use strict';

import React, {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'

import FriendsTab from './Friends'
import TabView from './TabView'
import Splash from './Splash'
import Login from './Login'
import Chat from './Chat'

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
            <Route name="tab2" schema="tab" title="Tab #2" component={TabView}/>
          </Router>
        </Route>
        <Route name="chat" component={Chat} title="Chat" />
        <Route name="splash" component={Splash} initial={true} wrapRouter={true} title="Splash"/>
      </Router>
    );
  }
}

module.exports = App