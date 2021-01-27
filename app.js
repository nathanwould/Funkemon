let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
let masterGainNode = null;

let keyboard = document.querySelector(".keyboard");
let wavePicket = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let noteFreq = null;
let customWaveForm = null;
let sineTerms = null;
let cosineTerms = null;

function createNoteTabel() {
  let noteFreq = [];
  for (let i = 0; i < 3; i++) {
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
}

function setup() {
  noteFreq = createNoteTable();

  columeControl.addEventListener("change", changeVolume, falese);

  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;

  noteFreq.forEach(function (keys, idx) {
    let keyList = Object.entries(keys);
    let octaveElem = document.createElement("div");
    octaveElem.className = 'octave'

    keyList.forEach(function (key) {
      octaveElem.appendChild(createKey(key[0], idx, key[1]));

    });
    keyboard.appendChild(octaveElem);
  })

  sineTerms = new Float32Array([0, 0, 1, 0, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveForm = audioContext.createPeriodicWave(cosineTerms, sineTerms);

  for (i = 0; i < 9; i++) {
    oscList[i] = {};
  }
}

setup()

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");
  let labelElement = document.createElement("div");

  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  keyElement.dataset['frequency'] = freq;

  labelElement.innerHTML = note + '<sub>' + octave + '</sub>';
  keyElement.appendChild(labelElement);

  keyElement.addEventListener('mousedown', notePressed, false);
  keyElement.addEvenetListener('mouseup', noteReleased, false);
  keyElement.addEventListener('mouseover', notePressed, false);
  keyElement.addEventListener('mouseleave', noteReleased, false);

  return keyElement
}