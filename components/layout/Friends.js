var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  PixelRatio,
  TouchableHighlight
} = React;

import {Actions} from 'react-native-router-flux'
import faker from 'faker'
var GiftedListView = require('react-native-gifted-listview');

var XPush = require('../libs/xpush');
var Utils = require('../Utils');


var TESTED_COUNT = 10;

/*
var Tested_data = []

for ( var i =0 ; i < TESTED_COUNT ; i++){
  Tested_data.push(
    {id: faker.internet.email(),
    picture: "http://quinnpalmer.co/wp-content/uploads/2013/04/Circle-Profile.png",
    name:  faker.name.findName(),
    text: faker.lorem.sentence(),
    date: faker.date.past()
   }
  ) 
}
*/

var Friends = React.createClass({

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    XPush.INSTANCE.getGroupUsers( XPush.INSTANCE.userId, function( err, users ){
      callback( users );
    });
  },


  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    var jsonObject = {};
    jsonObject.U = [rowData.U,XPush.INSTANCE.userId];
    var channelId = Utils.generateChannelId( jsonObject );
    Actions.chat({'data':{'C':channelId,'US':jsonObject.U,'NM':rowData.DT.NM}});
  },

  /**
   * Render a row
   * @param {object} rowData Row data
   */
  _renderRowView(rowData) {
      var person = rowData;

        return (
        <TouchableHighlight 
            style={styles.container} 
            underlayColor='#c8c7cc'
            onPress={() => this._onPress(rowData)}
        >  
          <View>
            <View style={ styles.row }>
              <Image
                source={ { uri: person.DT.I } }
                style={ styles.cellImage } />
              <View style={ styles.textContainer }>
                <Text style={ styles.name } numberOfLines={ 1 }>
                  { person.DT.NM }
                </Text>
                <Text style={ styles.lastMessage } numberOfLines={ 1 }>
                  { person.DT.MG }
                </Text>
              </View>
            </View>
            <View style={ styles.cellBorder } />
          </View>
        </TouchableHighlight>
        );
  },

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.navBar} />
        <GiftedListView
          rowView={this._renderRowView}
          onFetch={this._onFetch}
          firstLoader={true} // display a loader for the first fetching
          pagination={false} // enable infinite scrolling using touch to load more
          refreshable={false} // enable pull-to-refresh for iOS and touch-to-refresh for Android
          withSections={false} // enable sections
          customStyles={{
            refreshableView: {
              backgroundColor: '#eee',
            },
          }}

          PullToRefreshViewAndroidProps={{
            colors: ['#ff0000', '#00ff00', '#0000ff'],
            progressBackgroundColor: '#c8c7cc',
          }}
        />
      </View>
    );
  }
});

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 64,
    backgroundColor: '#CCC'
  },
  row: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 10
  },
  textContainer: {
    flex: 1
  },  
  cellImage: {
    height: 60,
    borderRadius: 30,
    marginRight: 10,
    width: 60
  },
  time: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 12,
    color: '#cccccc'
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2
  },
  lastMessage: {
    color: '#999999',
    fontSize: 12
  },
  cellBorder: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1 / PixelRatio.get(),
    marginLeft: 4
  }
};

module.exports = Friends;
