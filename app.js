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
  for (let i = 1; i < 4; i++) {
    noteFreq[i] = [];
  }
  noteFreq[1]["A"] = 55.000000000000000;
  noteFreq[1]["W"] = 58.270470189761239;
  noteFreq[1]["S"] = 61.735412657015513;
  noteFreq[2]["D"] = 65.4063913251;
  noteFreq[2]["R"] = 69.2956577442;
  noteFreq[2]["F"] = 73.4161919794;
  noteFreq[2]["T"] = 77.7817459305;
  noteFreq[2]["G"] = 82.4068892282;
  noteFreq[2]["H"] = 87.3070578583;
  noteFreq[2]["U"] = 92.4986056779;
  noteFreq[2]["J"] = 97.9988589954;
  noteFreq[2]["I"] = 103.826174395;
  noteFreq[2]["K"] = 110.000000000000000;
  noteFreq[2]["O"] = 116.54094038;
  noteFreq[2]["L"] = 123.470825314;
  noteFreq[3][":"] = 130.81278265;
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

  for (i = 0; i < 4; i++) {
    oscList[i] = {};
  }
}

// setup()

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");


  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  keyElement.dataset['frequency'] = freq;
  keyElement.innerHTML = note;


  keyElement.addEventListener('mousedown', notePressed);
  keyElement.addEventListener('mouseup', noteReleased);
  keyElement.addEventListener('mouseover', notePressed);
  keyElement.addEventListener('mouseleave', noteReleased);
  keyElement.addEventListener('keydown', keyPressed);
  keyElement.addEventListener('keyup', noteReleased);

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
  audioContext.resume();

  if (event.buttons & 1) {
    let dataset = event.target.dataset;

    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  }
}

function keyPressed(key) {
  audioContext.resume();
  switch (key) {
    case "a":
      console.log("I'm working!")
  }
}

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset['pressed']) {
    let octave = +dataset['octave'];
    oscList[octave][dataset['note']].stop();
    delete oscList[octave][dataset['note']];
    delete dataset['pressed'];
  }
}

function changeVolume(event) {
  masterGainNode.gain.value = volumeControl.value
}