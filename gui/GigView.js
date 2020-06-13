import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SectionList, TouchableOpacity, Alert, Picker, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Controller from './GigController';

export default class GigView extends Component {
  constructor () {
    super();
    this.controller = new Controller();
    this.state = { controller: this.controller };
  }

  _refresh () {
    this.setState({ controller: this.controller });
  }

  _loadFromDropbox () {
    var that = this;
    this.controller.spinning = true;
    this._refresh();
    this.controller.loadClicked()
      .then(
        function () {
          that.controller.spinning = false;
          that._refresh();
        },
        function (error) {
          that.controller.spinning = false;
          alert(error);
          Alert.alert(
            'Dropbox error',
            error,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        }
      );
  }

  render () {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 10, flexDirection: 'row', paddingBottom: 10, alignItems: 'center' }}>
          <View style={{ flex: 50, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.gigLabel}>Gig</Text>
            <Picker style={styles.gigSelect}
              selectedValue={this.state.controller.model.selectedGigName}
              onValueChange={ (itemValue, itemIndex) => {
                this.state.controller.gigSelected(itemIndex);
                this._refresh();
              }}>
              {
                this.state.controller.model.dataset.gigs.map((item) => {
                  return (<Picker.Item key='DUMMY' label={item.band + ' - ' + item.event} value={item.band + ' - ' + item.event} />);
                })
              }
            </Picker>
            <TouchableOpacity style={styles.padButton} onPress={ () => this._loadFromDropbox() }>
              <Text style={styles.padText}>Fetch</Text>
            </TouchableOpacity>
            <ActivityIndicator size="small" animating={this.state.controller.spinning} />
          </View>
          <View style={{ flex: 50, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Text style={styles.logo}>Igigi</Text>
            <View style={{ flex: 0.01 }} />
            <Image source={require('../assets/igigi_logo.png')} style={{ width: 50, height: 50 }}></Image>
          </View>
        </View>
        <View style={{ flex: 90, flexDirection: 'row' }}>
          <View style={{ flex: 25 }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.songButton} onPress={ () => {
                this.controller.nextSongClicked();
                this._refresh();
              }}>
                <Text>Next</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.songButton} onPress={ () => {
                this.controller.supposedSongClicked();
                this._refresh();
              }}>
                <Text>Suggest</Text>
              </TouchableOpacity>
            </View>
            <SectionList
              sections={this.state.controller.model.gigSets}
              renderItem={({ item }) =>
                <TouchableOpacity onPress={() => {
                  this.controller.songSelected(item);
                  this._refresh();
                }}>
                  <Text style={styles.songListItem}>{item}</Text>
                </TouchableOpacity>
              }
              renderSectionHeader={({ section }) => <Text style={styles.songListSet}>{section.title}</Text>}
              keyExtractor={(item, index) => index.toString()} />
            <Text style={styles.inactiveSong}>Inactive: {this.state.controller.model.getInactiveSongCSV()}</Text>
            <Text style={styles.inactiveSong}>Filtered: {this.state.controller.model.getFilteredSongCSV()}</Text>
          </View>
          <View style={{ flex: 75, flexDirection: 'column' }}>
            <View style={{ flex: 80 }}>
              <Text style={styles.songTitle}>{this.state.controller.model.song.name} ({this.state.controller.model.song.key})</Text>
              <FlatList
                data={this.state.controller.model.lyrics}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <Text style={styles.lyrics}>{item}</Text>}
              />
            </View>
            <View style={{ flex: 20, flexDirection: 'row' }}>
              <TouchableOpacity style={styles.padButton} onPress={ () => this.state.controller.padClicked(0) }>
                <Text style={styles.padText}>{this.state.controller.sampler.pads[0].sample.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padButton} onPress={ () => this.state.controller.padClicked(1) }>
                <Text style={styles.padText}>{this.state.controller.sampler.pads[1].sample.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padButton} onPress={ () => this.state.controller.padClicked(2) }>
                <Text style={styles.padText}>{this.state.controller.sampler.pads[2].sample.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padButton} onPress={ () => this.state.controller.padClicked(3) }>
                <Text style={styles.padText}>{this.state.controller.sampler.pads[3].sample.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padButton} onPress={ () => this.state.controller.padClicked(4) }>
                <Text style={styles.padText}>{this.state.controller.sampler.pads[4].sample.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.padStopButton} onPress={ () => this.state.controller.padClicked(4) }>
                <Text style={styles.padText}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  songListSet: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'lightgray'
  },
  songListItem: {
    padding: 10,
    fontSize: 14,
    height: 30,
    color: 'dimgrey'
  },
  inactiveSong: {
    padding: 10,
    fontSize: 12,
    color: 'dimgrey'
  },
  songTitle: {
    paddingBottom: 10,
    paddingLeft: 10,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10
  },
  lyrics: {
    fontSize: 20,
    paddingLeft: 10
  },
  lyricScroll: {
    paddingBottom: 10,
    marginLeft: 10,
    height: 300
  },
  logo: {
    paddingBottom: 10,
    fontSize: 30,
    fontWeight: 'bold'
  },
  gigLabel: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 25,
    fontWeight: 'bold',
    flex: 20
  },
  gigSelect: {
    flex: 80
  },
  padButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 25,
    flex: 20,
    margin: 10
  },
  padStopButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 25,
    flex: 20,
    margin: 10
  },
  padText: {
    textAlign: 'center'
  },
  songButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 25,
    flex: 50,
    margin: 10
  }
});
