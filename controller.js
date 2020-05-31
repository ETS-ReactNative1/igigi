import Model from './model';
import Sampler from './sampler';

export default class Controller {
  constructor () {
    this.model = new Model();
    this.model.loadSampleFile();

    this.sampler = new Sampler();
    this.sampler.loadSampleList(this.model.dataset.samples);

    this._songChanged();
  }

  songSelected (screenName) {
    this.model.setSongByScreenName(screenName);
    this._songChanged();
  }

  nextSongClicked () {
    this.model.setNextSong();
    this._songChanged();
  }

  supposedSongClicked () {
    this.model.setSupposedSong();
    this._songChanged();
  }

  padClicked (index) {
    this.sampler.playPad(index);
  }

  padStopClicked () {
    this.sampler.stopAllPads();
  }

  gigSelected (index) {
    this.model.setGigByIndex(index);
    this._songChanged();
  }

  _songChanged () {
    this.sampler.loadSong(this.model.song);
  }
}
