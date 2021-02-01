// First, the PokeAPI axios call and functionality to search and display a pokemon sprite
async function catchEm(pokeName) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokeName}`;
  try {
    let response = await axios.get(url);
    let data = response.data
    console.log(data)
    showPoke(data);
  } catch (error) {
    console.log(error)
  }
}

// display pokemon sprite and name
function showPoke(data) {
  let container = document.querySelector("#pokeDiv")
  let pokeSprite = document.createElement('img')
  let pokeName = document.createElement('h3')
  pokeSprite.src = `${data.sprites.front_default}`
  pokeSprite.id = 'sprite'
  pokeSprite.className = 'animate__animated'

  pokeName.innerHTML = `${data.name}`

  container.append(pokeSprite)
  container.append(pokeName)
}

// Event listener and form to capture pokemon search
let form = document.querySelector('form')

form.addEventListener('submit', (e) => {
  e.preventDefault()
  removeImage()
  const inputValue = document.querySelector('#pokeSearch').value.toLowerCase()
  catchEm(inputValue)
})

// remove existing sprite image if present
function removeImage() {
  let removeDiv = document.querySelector('#pokeDiv');
  while (removeDiv.lastChild) {
    removeDiv.removeChild(removeDiv.lastChild)
  }
}

// function to make the sprites 'dance'
document.addEventListener('keydown', pokeDance)

function pokeDance() {
  let sprite = document.querySelector('#sprite')
  if (!sprite.dataset['dance']) {
    sprite.dataset['dance'] = 'yes';
  } else {
    delete sprite.dataset['dance'];
  }
}

// Then building the audio properties and elements. This Project draws heavily on the MDN tutorial on building a simple Web Audio synthesizer. https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Simple_synth

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let oscList = [];
let masterGainNode = null;

let keyboard = document.querySelector(".keys");
let wavePicker = document.querySelector("select[name='waveform']");
let volumeControl = document.querySelector("input[name='volume']");

let noteFreq = null;
let customWaveForm = null;
let sineTerms = null;
let cosineTerms = null;

// Building the set of frequencies we'll access later and use to build the keys

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
  noteFreq[3][";"] = 130.81278265;
  return noteFreq
}

// Initializes the audio context, creates gain nodes, and builds the keys

window.onload = function setup() {

  var context = new AudioContext();

  noteFreq = createNoteTabel()
  volumeControl.addEventListener("change", changeVolume, false);

  masterGainNode = audioContext.createGain();
  masterGainNode.connect(audioContext.destination);
  masterGainNode.gain.value = volumeControl.value;

  noteFreq.forEach(function (keys, index) {
    let keyList = Object.entries(keys);
    keyList.forEach(function (key) {
      keyboard.appendChild(createKey(key[0], index, key[1]));

    });
  })

  // Literally no clue what exactly this is doing

  sineTerms = new Float32Array([0, 4, 1, 1, 1]);
  cosineTerms = new Float32Array(sineTerms.length);
  customWaveForm = audioContext.createPeriodicWave(cosineTerms, sineTerms);

  for (i = 0; i < 4; i++) {
    oscList[i] = {};
  }
}

// Function called earlier to create keys with datasets to be accessed on event, along with listeners for mouse events

function createKey(note, octave, freq) {
  let keyElement = document.createElement("div");
  let nameSpan = document.createElement("span");

  keyElement.className = 'key';
  keyElement.dataset['octave'] = octave;
  keyElement.dataset['note'] = note;
  if (keyElement.dataset['note'] === ';') {
    keyElement.id = 'semi'
  } if (keyElement.dataset['note'] === 'W' || keyElement.dataset['note'] === 'R' || keyElement.dataset['note'] === 'T' || keyElement.dataset['note'] === 'U' || keyElement.dataset['note'] === 'I' || keyElement.dataset['note'] === 'O') {
    keyElement.dataset['blackKey'] = 'yes'
  } else {
    keyElement.dataset['whiteKey'] = 'yes'
  }
  keyElement.dataset['keyboard'] = keyboard
  keyElement.dataset['frequency'] = freq;
  keyElement.className = `key ${note}`;
  keyElement.append(nameSpan);
  nameSpan.innerHTML = note;
  nameSpan.classList.add('nameSpan')

  keyElement.addEventListener('mousedown', notePressed);
  keyElement.addEventListener('mouseup', noteReleased);
  keyElement.addEventListener('mouseover', notePressed);
  keyElement.addEventListener('mouseleave', noteReleased);

  keyElement.addEventListener('mousedown', pokeDance);

  return keyElement
}

// and global listeners for key events

document.addEventListener('keydown', keyPressed);
document.addEventListener('keyup', keyReleased);

// a pinking filter that softens the default oscillator wave sounds, by Zach Denton https://noisehack.com/custom-audio-effects-javascript-web-audio-api/

var bufferSize = 256;
var effect = (function () {
  var b0, b1, b2, b3, b4, b5, b6;
  b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
  var node = audioContext.createScriptProcessor(bufferSize, 1, 1);
  node.onaudioprocess = function (e) {
    var input = e.inputBuffer.getChannelData(0);
    var output = e.outputBuffer.getChannelData(0);
    for (var i = 0; i < bufferSize; i++) {
      b0 = 0.99886 * b0 + input[i] * 0.0555179;
      b1 = 0.99332 * b1 + input[i] * 0.0750759;
      b2 = 0.96900 * b2 + input[i] * 0.1538520;
      b3 = 0.86650 * b3 + input[i] * 0.3104856;
      b4 = 0.55000 * b4 + input[i] * 0.5329522;
      b5 = -0.7616 * b5 - input[i] * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + input[i] * 0.5362;
      output[i] *= 0.11; // (roughly) compensate for gain
      b6 = input[i] * 0.115926;
    }
  }
  return node;
})();


// function to initialize oscillator

function playTone(freq) {
  let osc = audioContext.createOscillator();

  var biquadFilter = audioContext.createBiquadFilter();
  biquadFilter.type = "lowpass"
  biquadFilter.frequency.setValueAtTime(2000, audioContext.currentTime);

  osc.connect(masterGainNode);
  osc.connect(effect)
  osc.connect(biquadFilter)
  effect.connect(audioContext.destination)
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

// Functions to call playTone and noteReleased functions on event

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

function noteReleased(event) {
  let dataset = event.target.dataset;

  if (dataset && dataset['pressed']) {
    let octave = +dataset['octave'];
    oscList[octave][dataset['note']].stop();
    delete oscList[octave][dataset['note']];
    delete dataset['pressed'];
  }
}

// Volume slider functionality

function changeVolume(event) {
  masterGainNode.gain.value = volumeControl.value
}


// All of the individual key events, good lord

function keyPressed(event) {
  audioContext.resume();
  if (event.code == 'KeyA') {
    dataset = document.querySelector('.A').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyW') {
    dataset = document.querySelector('.W').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyS') {
    dataset = document.querySelector('.S').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyD') {
    dataset = document.querySelector('.D').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyR') {
    dataset = document.querySelector('.R').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyF') {
    dataset = document.querySelector('.F').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyT') {
    dataset = document.querySelector('.T').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyG') {
    dataset = document.querySelector('.G').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyH') {
    dataset = document.querySelector('.H').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyU') {
    dataset = document.querySelector('.U').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyJ') {
    dataset = document.querySelector('.J').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyI') {
    dataset = document.querySelector('.I').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyK') {
    dataset = document.querySelector('.K').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyO') {
    dataset = document.querySelector('.O').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.code == 'KeyL') {
    dataset = document.querySelector('.L').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  } if (event.keyCode == 186) {
    dataset = document.querySelector('#semi').dataset
    if (!dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']] = playTone(dataset["frequency"]);
      dataset['pressed'] = 'yes';
    }
  }
}

function keyReleased(event) {

  if (event.code == 'KeyA') {
    dataset = document.querySelector('.A').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyW') {
    dataset = document.querySelector('.W').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyS') {
    dataset = document.querySelector('.S').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyD') {
    dataset = document.querySelector('.D').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyR') {
    dataset = document.querySelector('.R').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyF') {
    dataset = document.querySelector('.F').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyT') {
    dataset = document.querySelector('.T').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyG') {
    dataset = document.querySelector('.G').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyH') {
    dataset = document.querySelector('.H').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyU') {
    dataset = document.querySelector('.U').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyJ') {
    dataset = document.querySelector('.J').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyI') {
    dataset = document.querySelector('.I').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyK') {
    dataset = document.querySelector('.K').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyO') {
    dataset = document.querySelector('.O').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.code == 'KeyL') {
    dataset = document.querySelector('.L').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  } if (event.keyCode == 186) {
    dataset = document.querySelector('#semi').dataset
    if (dataset && dataset['pressed']) {
      let octave = +dataset['octave'];
      oscList[octave][dataset['note']].stop();
      delete oscList[octave][dataset['note']];
      delete dataset['pressed'];
    }
  }
}
