
'use strict';
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableHighlight, Image} from 'react-native'

import {Actions} from 'react-native-router-flux'

var Constants = require('../Constants');
var SessionStore = require('../stores/SessionStore');

var XPush = require('../libs/xpush');

var styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
        backgroundColor:'white'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        color: 'black',        
        backgroundColor: 'rgba(0,0,0,0)',        
        margin: 10
    },    
    logo: {
        width: 100,
        height: 100
    }
});

class Splash extends Component {
    componentDidMount() {
        setTimeout(function(){
            SessionStore.get(function(user){

                if( !user ){
                    Actions.login();  
                } else {
                    XPush.INSTANCE.login( user.U, user.PW, 'messengerx', function(err, result){
                        Actions.tabbar();
                    });
                }
            });

        }, 1000 ) 
    }
    render(){
        return (
            <View style={styles.container}>            
                <Text style={styles.welcome}>
                  Welcome to MessengerX!
                </Text>
            </View>
        );
    }
}

module.exports = Splash;