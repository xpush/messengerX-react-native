'use strict';

import React, {AppRegistry, Navigator, StyleSheet, Text, View} from 'react-native'
import {Router, Route, Schema, Animations, TabBar} from 'react-native-router-flux'

import FriendsTab from './Friends'
import TabView from './TabView'
import Splash from './Splash'

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
            <Router hideNavBar={true}>
                <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                <Schema name="withoutAnimation"/>
                <Schema name="tab" type="switch" icon={TabIcon} />

                <Route name="splash" component={Splash} initial={true} title="Splash"/>
                <Route name="friendsTab" component={FriendsTab} title="Friends" />
            </Router>
        );
    }
}

module.exports = App