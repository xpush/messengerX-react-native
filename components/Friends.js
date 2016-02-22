var React = require('react-native');
var {
  StyleSheet,
  Text,
  Image,
  View,
  PixelRatio,
  TouchableHighlight
} = React;

import faker from 'faker'
var GiftedListView = require('react-native-gifted-listview');


var TESTED_COUNT = 10;

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

var Friends = React.createClass({

  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    setTimeout(() => {
      /*
      var rows = ['row '+((page - 1) * 3 + 1), 'row '+((page - 1) * 3 + 2), 'row '+((page - 1) * 3 + 3)];
      if (page === 3) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });        
      } else {
        callback(rows);
      }
      */
      callback(Tested_data);
      
    }, 1000); // simulating network fetching
  },


  /**
   * When a row is touched
   * @param {object} rowData Row data
   */
  _onPress(rowData) {
    console.log(rowData+' pressed');
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
            source={ { uri: person.picture } }
            style={ styles.cellImage } />
          <View style={ styles.textContainer }>
            <Text style={ styles.name } numberOfLines={ 1 }>
              { person.name }
            </Text>
            <Text style={ styles.time } numberOfLines={ 1 }>
              { person.name }
            </Text>
            <Text style={ styles.lastMessage } numberOfLines={ 1 }>
              { person.text }
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
          pagination={true} // enable infinite scrolling using touch to load more
          refreshable={true} // enable pull-to-refresh for iOS and touch-to-refresh for Android
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
