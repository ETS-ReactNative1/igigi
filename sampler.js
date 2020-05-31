import { Audio } from 'expo-av';
const _PAD_COUNT = 5;

export default class Sampler {
  constructor () {
    this._initializeSamples();
    this._initializePads();
  }

  loadSampleList (sampleList) {
    this._initializeSamples();
    for (var sampleIndex = 0; sampleIndex < sampleList.length; sampleIndex++) {
      var newSample = new Sample();
      newSample.loadDict(sampleList[sampleIndex]);
      this.samples.push(newSample);
    }
  }

  loadSong (song) {
    this._initializePads();

    for (var ss = 0; ss < song.pads.length; ss++) {
      if (ss < _PAD_COUNT) {
        for (var t = 0; t < this.samples.length; t++) {
          if (this.samples[t].name === song.pads[ss]) {
            this.pads[ss].sample = this.samples[t];
          }
        }
      }
    }
  }

  playPad (index) {
    this.stopAllPads();
    this.pads[index].sample.play();
  }

  stopAllPads () {
    for (var i = 0; i < this.pads.length; i++) {
      this.pads[i].sample.stop();
    }
  }

  _initializeSamples () {
    this.samples = [];
  }

  _initializePads () {
    this.pads = [];

    for (var p = 0; p < _PAD_COUNT; p++) {
      this.pads.push(new Pad());
    }
  }
}

class Pad {
  constructor () {
    this.sample = new Sample();
  }
}

class Sample {
  constructor () {
    this.name = '';
    this.file = '';
    this.audio = null;
  }

  loadDict (sampleDict) {
    // todo burada gerçek dosya yüklenecek
    this.name = sampleDict.name;
    this.file = sampleDict.file;
    this.audio = new Audio.Sound();
    this.audio.loadAsync(require('./assets/sample_chime.mp3'));
  }

  play () {
    if (this.audio === null) { return; }
    this.audio.playAsync();
  }

  stop () {
    if (this.audio === null) { return; }
    this.audio.stopAsync();
  }
}
