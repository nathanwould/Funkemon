let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
let masterGainNode = null;

let keyboard = document.querySelector(".keyboard");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let noteFreq = null;
let customWaveForm = null;
let sineTerms = null;
let cosineTerms = null;

function createNoteTabel() {
  let noteFreq = [];
  for (let i = 0; i < 2; i++) {
    noteFreq[i] = [];
  }
  noteFreq[0]["A"] = 27.500000000000000;
  noteFreq[0]["Bb"] = 29.135235094880619;
  noteFreq[0]["B"] = 30.867706328507756;

  noteFreq[1]["C"] = 32.703195662574829;
  noteFreq[1]["C#"] = 34.647828872109012;
  noteFreq[1]["D"] = 36.708095989675945;
  noteFreq[1]["Eb"] = 38.890872965260113;
  noteFreq[1]["E"] = 41.203444614108741;
  noteFreq[1]["F"] = 43.653528929125485;
  noteFreq[1]["F#"] = 46.249302838954299;
  noteFreq[1]["G"] = 48.999429497718661;
  noteFreq[1]["Ab"] = 51.913087197493142;
  noteFreq[1]["A"] = 55.000000000000000;
  noteFreq[1]["Bb"] = 58.270470189761239;
  noteFreq[1]["B"] = 61.735412657015513;

  return noteFreq
}

window.onload = function setup() {

  var context = new AudioContext();

  noteFreq = createNoteTabel()
  volumeControl.addEventListener("change", changeVolume, false);

  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;

  noteFreq.forEach(function (keys, index) {
    let keyList = Object.entries(keys);
    let octaveElem = document.createElement("div");
    octaveElem.className = 'octave'

    keyList.forEach(function (key) {
      octaveElem.appendChild(createKey(key[0], index, key[1]));

    });
    keyboard.appendChild(octaveElem);
  })

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveForm = audioContext.createPeriodicWave(cosineTerms, sineTerms);

  for (i = 0; i < 2; i++) {
    oscList[i] = {};
  }
}

// setup()

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  keyElement.dataset['frequency'] = freq;
  labelElement.innerHTML = note + '<sub>' + octave + '</sub>';
  keyElement.appendChild(labelElement);

  keyElement.addEventListener('mousedown', notePressed);
  keyElement.addEventListener('mouseup', noteReleased);
  keyElement.addEventListener('mouseover', notePressed);
  keyElement.addEventListener('mouseleave', noteReleased);

  return keyElement
}

function playTone(freq) {
  let osc = audioContext.createOscillator();
  osc.connect(masterGainNode);
  let type = wavePicker.options[wavePicker.selectedIndex].value;

  if (type == 'custom') {
    osc.setPeriodicWave(customWaveForm);
  } else {
    osc.type = type;
  }
  osc.frequency.value = freq;
  osc.start();

  return osc
}

function notePressed(event) {
  audioContext.resume()

  if (event.buttons & 1) {
    let dataset = event.target.dataset;
    console.log(e.data)

    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  }
}

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset['pressed']) {
    let octave = +dataset['octave'];
    oscList[octave][dataset['note']].stop();
    delete oscList[octave][dataset['note']];
    delete dataset['pressed'];
    audioContext.pause();
  }
}

function changeVolume(event) {
  masterGainNode.gain.value = volumeControl.value
}