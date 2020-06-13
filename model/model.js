const _TIME_SONG_SEPARATOR = ' - ';
const _GIG_EVENT_SEPARATOR = ' - ';
const _HOUR_MINUTE_SEPARATOR = ':';

export default class Model {
  constructor () {
    this._initialize();
  }

  loadSampleFile () {
    var jsonContent = require('../assets/igigi_sample.json');
    this.loadJson(jsonContent);
  }

  loadJson (jsonContent) {
    this._initialize();
    this.dataset = jsonContent;
    this.setGigByIndex(0);
  }

  setGigByIndex (index) {
    this._setGig(this.dataset.gigs[index]);
  }

  setGigByName (bandName, eventName) {
    for (var gigIndex = 0; gigIndex < this.dataset.gigs.length; gigIndex++) {
      var gig = this.dataset.gigs[gigIndex];
      if (gig.band === bandName && gig.event === eventName) {
        this._setGig(gig);
        return;
      }
    }
  }

  setGigByScreenName (screenName) {
    var splits = screenName.split(_GIG_EVENT_SEPARATOR);
    var bandName = splits[0];
    var eventName = splits[1];
    this.setGigByName(bandName, eventName);
  }

  setSongByName (songName) {
    for (var setIndex = 0; setIndex < this.gig.sets.length; setIndex++) {
      var gigSet = this.gig.sets[setIndex];
      for (var songIndex = 0; songIndex < gigSet.songs.length; songIndex++) {
        var gigSong = gigSet.songs[songIndex];
        if (gigSong.name === songName) {
          this._setSong(gigSong);
          return;
        }
      }
    }
  }

  setSongByScreenName (screenName) {
    var splits = screenName.split(_TIME_SONG_SEPARATOR);
    var songName = splits[1];
    this.setSongByName(songName);
  }

  setNextSong () {
    var indices = this._getCurrentIndices();

    if (indices.song < this.gig.sets[indices.set].songs.length - 1) {
      var newSongIndex = indices.song + 1;
      this._setSong(this.gig.sets[indices.set].songs[newSongIndex]);
      return;
    }

    if (indices.set < this.gig.sets.length - 1) {
      var newSetIndex = indices.set + 1;
      var newSet = this.gig.sets[newSetIndex];
      if (newSet.songs.length <= 0) { return; }
      var newSong = newSet.songs[0];
      this._setSong(newSong);
    }
  }

  setSupposedSong () {
    var now = new Date();
    var nowTime = now.getHours() + _HOUR_MINUTE_SEPARATOR + now.getMinutes();

    for (var setIndex = 0; setIndex < this.gigSets.length; setIndex++) {
      var gigSet = this.gigSets[setIndex];
      for (var songIndex = 0; songIndex < gigSet.data.length; songIndex++) {
        var setSong = gigSet.data[songIndex];
        var songSplit = setSong.split(_TIME_SONG_SEPARATOR);
        var songTime = songSplit[0];
        var songName = songSplit[1];

        if (this._isTimeGE(nowTime, songTime)) {
          this.setSongByName(songName);
          return;
        }
      }
    }
  }

  getInactiveSongCSV () {
    var output = '';
    for (var i = 0; i < this.gig.inactive_songs.length; i++) {
      if (output !== '') { output += ', '; }
      output += this.gig.inactive_songs[i].name;
    }
    return output;
  }

  getFilteredSongCSV () {
    var output = '';
    for (var i = 0; i < this.gig.filtered_songs.length; i++) {
      if (output !== '') { output += ', '; }
      output += this.gig.filtered_songs[i].name;
    }
    return output;
  }

  _getCurrentIndices () {
    var output = {
      set: -1,
      song: -1
    };

    for (var setIndex = 0; setIndex < this.gig.sets.length; setIndex++) {
      var gigSet = this.gig.sets[setIndex];
      for (var songIndex = 0; songIndex < gigSet.songs.length; songIndex++) {
        var gigSong = gigSet.songs[songIndex];
        if (gigSong.name === this.song.name) {
          output.set = setIndex;
          output.song = songIndex;
        }
      }
    }

    return output;
  }

  _setGig (gig) {
    this.gig = gig;
    this.selectedGigName = gig.band + ' - ' + gig.event;

    this.gigSets = [];
    for (var i = 0; i < this.gig.sets.length; i++) {
      var setSongs = [];
      var setDateTime = new Date(this.gig.sets[i].start);
      setDateTime = this._getDatetimeMindingTimezone(setDateTime);

      for (var s = 0; s < this.gig.sets[i].songs.length; s++) {
        var hour = this._convExitTimeOutput(setDateTime.getHours());
        var minute = this._convExitTimeOutput(setDateTime.getMinutes());
        var songStartTime = hour + _HOUR_MINUTE_SEPARATOR + minute;
        var setSong = songStartTime + _TIME_SONG_SEPARATOR + this.gig.sets[i].songs[s].name;
        setSongs.push(setSong);
        setDateTime.setMinutes(setDateTime.getMinutes() + this.gig.sets[i].songs[s].duration);
      }

      var gigSet = {
        title: 'Set ' + (i + 1),
        data: setSongs
      };
      this.gigSets.push(gigSet);
    }

    if (this.gig.sets.length > 0) {
      var firstSet = this.gig.sets[0];
      if (firstSet.songs.length > 0) {
        this._setSong(firstSet.songs[0]);
      }
    }
  }

  _convExitTimeOutput (timePiece) {
    var output = '' + timePiece;
    while (output.length < 2) { output = '0' + output; }
    return output;
  }

  _setSong (gigSong) {
    this.song = gigSong;
    this.lyrics = this.song.lyrics;
  }

  _getDatetimeMindingTimezone (originalDate) {
    var userTimezoneOffset = 3 * 60 * 60000;
    return new Date(originalDate.getTime() - userTimezoneOffset);
  }

  _initialize () {
    this.dataset = {};
    this.gig = {};
    this.gigSets = [];
    this.lyrics = [];
    this.selectedGigName = '';
  }

  _isTimeGE (earlyTime, lateTime) {
    var earlySplit = earlyTime.split(_HOUR_MINUTE_SEPARATOR);
    var earlyHour = Number(earlySplit[0]);
    var earlyMinute = Number(earlySplit[1]);

    var lateSplit = lateTime.split(_HOUR_MINUTE_SEPARATOR);
    var lateHour = Number(lateSplit[0]);
    var lateMinute = Number(lateSplit[1]);

    if (lateHour < earlyHour) { return false; }
    if (lateHour > earlyHour) { return true; }
    return (lateMinute >= earlyMinute);
  }
}
