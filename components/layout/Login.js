var React = require('react-native');
var XPush = require('../libs/xpush');

import {Actions} from 'react-native-router-flux'

window.navigator.userAgent = 'react-native';

var {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  StyleSheet
} = React;

var SessionStore = require('../stores/SessionStore');

var Login = React.createClass({
  getInitialState: function() {
    return {
      userId: ''
    };
  },
  render: function() {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.input}
            value={this.state.userId}
            onChangeText={(text) => this.setState({userId: text})}
            placeholder={'Enter User ID'}
            maxLength={12}
            multiline={false}
            />

          <TextInput
            style={styles.input}
            value={this.state.password}
            onChangeText={(text) => this.setState({password: text})}
            placeholder={'Enter Password'}
            secureTextEntry={true}
            maxLength={12}
            multiline={false}
            />

          <TouchableHighlight
            style={styles.button}
            underlayColor={'#328FE6'}
            onPress={this.onPress}
            >
            <Text style={styles.label}>LOGIN</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  },
  onPress: function() {
    var self = this;
    XPush.INSTANCE.login( this.state.userId, this.state.password, 'ionic', function(err, result){
      var user = result.user;
      user.PW = self.state.password;
      SessionStore.save( user, function(res){
        Actions.tabbar();
      });
    });
  }
});

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