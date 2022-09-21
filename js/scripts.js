const jokeButton = document.getElementById('joke-button');
const apiUrl = 'https://sv443.net/jokeapi/v2/joke/any?type=single';
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');

if ('speechSynthesis' in window) {
  var synth = window.speechSynthesis;
} else {
  console.log('Text-to-speech not supported.');
}

// init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices()
  
  // loop through the voices and populate the select box
  voices.forEach(voice => {
    // create option element
    const option = document.createElement('option')
    // fill option with voice and language
    option.textContent = voice.name + '('+ voice.lang +')'
    // set needed option attributes
    option.setAttribute('data-lang', voice.lang)
    option.setAttribute('data-name', voice.name)
    voiceSelect.appendChild(option)
  })
}

getVoices()

if (synth.onvoiceschanged !== undefined){
  synth.onvoiceschanged = getVoices;
}




async function letSpeak (){
    try {
      const response = await fetch (apiUrl)
      const data = await response.json()
      console.log(data)
      var utterance = new SpeechSynthesisUtterance(data.joke);

      // speak end
      utterance.onend = e => {
        console.log('Done Speaking..')
      }

      // Error speaking
      utterance.onerror = e => {
        console.log('Something went wrong..')
      }

      // Set a default selected voice
      const selectedVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')

      // looping though the voices
      voices.forEach(voice => {
        if(voice.name === selectedVoice){
          utterance.voice = voice
        }
      })

      // set  rate
      utterance.rate = rate.value;

      // set pitch
      utterance.pitch = pitch.value;

      synth.speak(utterance)

    }
    catch (e){
      console.log(e)
    }
} 

// Voice change
voiceSelect.addEventListener('change', e => letSpeak() )

// Rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value)

// pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)


jokeButton.addEventListener('click', letSpeak);