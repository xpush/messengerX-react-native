
'use strict';

import React, {View, Text, StyleSheet, TouchableHighlight,Image} from 'react-native'
import {Actions} from 'react-native-router-flux'

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



class Splash extends React.Component {
    componentDidMount() {
        setTimeout(function(){              
            Actions.tabbar();
        }, 500 ) 
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