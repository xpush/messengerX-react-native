
import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet, TouchableHighlight, Image, AlertIOS} from 'react-native'
import {Actions} from 'react-native-router-flux'

var XPush = require('../libs/xpush');

window.navigator.userAgent = 'react-native';

var SessionStore = require('../stores/SessionStore');

class Login extends Component {

  constructor(props) {
    super(props);
    this._onPress = this._onPress.bind(this);
    this.state = {userId: ''};
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TextInput
            autoCapitalize="none"
            style={styles.input}
            value={this.state.userId}
            onChangeText={(text) => this.setState({userId: text})}
            placeholder={'Enter User ID'}
            maxLength={12}
            multiline={false}
            />

          <TextInput
            autoCapitalize="none"
            style={styles.input}
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            placeholder={'Enter Password'}
            secureTextEntry={true}
            maxLength={12}
            multiline={false}
            />

          <TextInput
            autoCapitalize="none"
            style={styles.input}
            value={this.state.confirmPassword}
            onChangeText={(text) => this.setState({confirmPassword: text})}
            placeholder={'Enter Confirm Password'}
            secureTextEntry={true}
            maxLength={12}
            multiline={false}
            />

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this._onPress}
            >
            <Text style={styles.label}>Register</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
  _onPress() {
    if( this.state.password != this.state.confirmPassword  ){
      AlertIOS.alert(
        '',
        'Please check password.'
      );
      return;
    }

    var self = this;
    XPush.INSTANCE.signup( this.state.userId, this.state.password, 'messengerx', function(err, result){
      if( result.status == "ok" ){
        Actions.login({});        
      }
    });
  }
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'white'
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 250,
    color: '#555555',
    padding: 10,
    height: 50,
    borderColor: '#dadada',
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'center',
    backgroundColor: '#ffffff'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
    backgroundColor: '#4a8ec2'
  },
  label: {
    width: 230,
    flex: 1,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff'
  }
});

module.exports = Login;