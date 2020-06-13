import Model from '../model/model';
import Sampler from '../model/sampler';
import Dropbox from '../model/dropbox';

export default class Controller {
  constructor () {
    this.model = new Model();
    this.model.loadSampleFile();

    this.sampler = new Sampler();
    // this.sampler.loadSampleList(this.model.dataset.samples);

    this.dropbox = new Dropbox();
    this.spinning = false;
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

  async loadClicked () {
    var jsonFromDropbox = await this.dropbox.getModelFile();
    this.model.loadJson(jsonFromDropbox);
    await this.sampler.loadSampleList(this.model.dataset.samples);
    this._songChanged();
  }

  _songChanged () {
    this.sampler.loadSong(this.model.song);
  }
}
