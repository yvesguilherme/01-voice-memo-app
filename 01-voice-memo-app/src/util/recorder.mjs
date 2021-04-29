export default class Recorder {

  constructor() {
    this.audioType = 'audio/webm;codecs=opus';
    this.mediaRecorder = {};

    this.recorderBlobs = [];
  }

  _setup() {
    const options = { mimeType: this.audioType };
    const isSupported = MediaRecorder.isTypeSupported(options.mimeType);

    if (!isSupported) {
      const msg = `The codec: ${options.mimeType} isn't supported!!`;

      alert(msg);

      throw new Error(msg);
    }

    return options;
  }

  startRecording(streamAudio) {
    const options = this._setup();
    this.mediaRecorder = new MediaRecorder(streamAudio, options);

    this.mediaRecorder.onstop = (event) => {
      console.log('Recorded Blobs', this.recorderBlobs);
    };

    this.mediaRecorder.ondataavailable = (event) => {
      if (!event.data || !event.data.size) {
        return;
      }

      this.recorderBlobs.push(event.data);
    };

    this.mediaRecorder.start();

    console.log('Media recorded started', this.mediaRecorder);
  }

  async stopRecording() {
    if (this.mediaRecorder.state === 'inactive') {
      return;
    }

    this.mediaRecorder.stop();

    console.log('Media recorded stopped!');
  }

  getRecordingURL() {
    const blob = new Blob(this.recorderBlobs, { type: this.audioType });

    return window.URL.createObjectURL(blob);
  }
}