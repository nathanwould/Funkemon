# Project Overview

## Project Name

PokeSynth

## Project Description

A digital synthesizer that lets you select a Pokemon friend to dance with you.

## API and Data Sample

The synthesizer is built using AudioContext, OscillatorNode, PeriodicWave, and GainNode web APIs along with data pulled from PokeAPI.

https://developer.mozilla.org/en-US/docs/Web/API/AudioContext

https://pokeapi.co/

```json
"abilities": [
        {
            "ability": {
                "name": "immunity",
                "url": "https://pokeapi.co/api/v2/ability/17/"
            },
            "is_hidden": false,
            "slot": 1
        },
        {
            "ability": {
                "name": "thick-fat",
                "url": "https://pokeapi.co/api/v2/ability/47/"
            },
            "is_hidden": false,
            "slot": 2
        },
        {
            "ability": {
                "name": "gluttony",
                "url": "https://pokeapi.co/api/v2/ability/82/"
            },
            "is_hidden": true,
            "slot": 3
        }
    ]    
```

## Wireframes

![alt text](https://i.imgur.com/f2EdxIh.png "Wireframe")

### MVP/PostMVP

#### MVP 

- Graphic keyboard interface of at least one chromatic octave that works on mouseclick and changes to indicate when key is pressed.
- Option for user to use computer keyboard to play.
- Several sounds to choose from, such as sine wave, square wave, triangle wave, sawtooth.
- Slider to adjust volume.
- Communicate with PokeAPI to access and display Pokemon sprite on the page.
- Toggle Pokemon sprite's HTML class on event to make it dance to the music.

#### PostMVP  

- CSS Transition and Animation Effects
- Option to search for a pokemon to be your dancing companion
- One or more advanced sounds (adding filters, LFO, additional perameters such as attack and decay)

## Project Schedule 

|  Day | Deliverable | Status
|---|---| ---|
|Jan 25| Prompt / Wireframes / Priority Matrix / Timeframes | Complete
|Jan 26| Project Approval, Core HTML Structure | Complete
|Jan 27| Core Keyboard Functionality, PokeAPI Integration | Complete
|Jan 28| CSS Styling, Pokemon Animations | Complete
|Jan 29| Complete MVP, Fine-Tune For Usability | Complete
|Jan 30| Post-MVP: Pokemon Search, Custom Synthesizer Sounds | Complete
|Feb 1| Presentations/Project Submission | Incomplete

## Priority Matrix

![alt text](https://i.imgur.com/7wbLQvB.png "Priority Matrix")

## Timeframes

| Component | Priority | Estimated Time | Actual Time |
| --- | :---: |  :---: | :---: |
| Core HTML | H | 1 hr| .5 hr |
| CSS | H | 3 hrs| 2 hrs |
| Flex Container/Flex Items | H | 3 hrs| 1 hr |
| PokeAPI Integration | H | 3 hrs| 1 hr |
| Keyboard Events Declaration | H | 2 hrs| 2 hrs |
| Keyboard Pitch Assignment | H | 2 hrs| 4 hrs |
| Web Audio API | H | 3 hrs| 3 hrs |
| Sound & Filter Exploration | H | 4 hrs| 4 hrs |
| Pokemon Animations | H | 2 hrs| 2 hrs |
| Advanced CSS | H | 4 hrs| 6 hrs |
| Fine-tune for mobile | M-H | 2 hrs | 2 hrs |
| Pokemon Search | M | 2 hrs| 1 hr |
| Create more sounds | L | 4 hrs| 4 hrs |
| Total | - | 38 hrs | 32 hrs |

## Code Snippet
``` 
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
```

## Change Log
 - Adjusted for presentation, readme updated (2/1/2021)
 - v1 uploaded (1/31/2021)
