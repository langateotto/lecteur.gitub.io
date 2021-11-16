import './lib/webaudio-controls.js';


const getBaseURL = () => {
  const base = new URL('.', import.meta.url);
  console.log("Base = " + base);
	return `${base}`;
};

const template = document.createElement("template");
template.innerHTML = `
  


  <audio id="myPlayer" crossorigin>
      <source src="audio.mp3" type="audio/ogg"/>
      <source src="audio.mp3" type="audio/mp3"/>
    </audio>
    

    <progress id= "progressRuler" min=0 value=0 step=1></progress>
    <br>
    <button id="playButton">Play</button>
    <button id="pauseButton">Pause</button>
    <button id="remiseAZero">Retour à zero</button>
    <button id="avance">Avancer de 10s</button>
    <button id="reculer">Reculer de 10s</button><br />
    
    Volume: 0 <input type="range" min=0 max=1 step=0.1 oninput="player.volume=this.value"> 1
    <br>
    <webaudio-knob id="knobVolume" tooltip="Volume:%s" src="./assets/imgs/Vintage_knob.png" sprites="100" value=1 min="0" max="1" step=0.01>
        Volume</webaudio-knob>
    <webaudio-knob id="knobStereo" tooltip="Balance:%s" src="./assets/imgs/bouton2.png" sprites="127" value=1 min="0" max="1" step=0.01>
        Balance G/D</webaudio-knob>

        <canvas id="mycanvas" width="150" height="150"></canvas>
   
        `;


class MyAudioPlayer extends HTMLElement {
  constructor() {
    super();
    this.volume = 1;
    this.attachShadow({ mode: "open" });
    //this.shadowRoot.innerHTML = template;
    this.shadowRoot.appendChild(template.content.cloneNode(true)); 

    this.basePath = getBaseURL(); // url absolu du composant
    // Fix relative path in WebAudio Controls elements
		this.fixRelativeImagePaths();

  }

  connectedCallback() {
    this.player = this.shadowRoot.querySelector("#myPlayer");
    this.player.loop = true;
    
    
    //création d'un context web audio
   

   
    this.declareListeners();
  }

  fixRelativeImagePaths() {
		// change webaudiocontrols relative paths for spritesheets to absolute
		let webaudioControls = this.shadowRoot.querySelectorAll(
			'webaudio-knob, webaudio-slider, webaudio-switch, img'
		);
		webaudioControls.forEach((e) => {
			let currentImagePath = e.getAttribute('src');
			if (currentImagePath !== undefined) {
				//console.log("Got wc src as " + e.getAttribute("src"));
				let imagePath = e.getAttribute('src');
        //e.setAttribute('src', this.basePath  + "/" + imagePath);
        e.src = this.basePath  + "/" + imagePath;
        //console.log("After fix : wc src as " + e.getAttribute("src"));
			}
		});
  }
  
  declareListeners() {
    this.shadowRoot.querySelector("#playButton").addEventListener("click", (event) => {
      this.play(); 
    });
    this.shadowRoot.querySelector("#pauseButton").addEventListener("click", (event) => {
      this.pause();
    });
    this.shadowRoot.querySelector("#remiseAZero").addEventListener("click", (event) => {
      this.remiseAZero();
    });
    this.shadowRoot.querySelector("#pauseButton").addEventListener("click", (event) => {
      this.pause();
    });
    this.shadowRoot.querySelector("#avance").addEventListener("click", (event) => {
      this.player.currentTime+=10;
    });
    this.shadowRoot.querySelector("#reculer").addEventListener("click", (event) => {
      this.player.currentTime-=10;
    });
    this.canvas = document.getElementById('#mycanvas');
    this.context = canvas.getContext('2d');
    

    this.shadowRoot
      .querySelector("#knobVolume")
      .addEventListener("input", (event) => {
        this.setVolume(event.target.value);
      });
     

      this.player.addEventListener('timeupdate', (event)=>{ 
        console.log("time= "+ this.player.currentTime + "total duration= " + this.player.duration);
        
        let p = this.shadowRoot.querySelector("#progressRuler");
        try{
          p.max =this.player.duration.toFixed(15);
          p.value = this.player.currentTime;
        } catch(err){
           //console.log(err);
        }
        
      });
  }

  // API
  setVolume(val) {
    this.player.volume = val;
  }
  
  play() {
    this.player.play();
  }
  pause(){
    this.player.pause();
  }
  remiseAZero(){
    this.player.currentTime =0;
  }
}

customElements.define("my-audioplayer", MyAudioPlayer);
