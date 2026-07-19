const timeIndicator =
document.getElementById("timeIndicator");

function updateEnvironment(){

    const hour = new Date().getHours();

    if(hour >= 6 && hour < 18){

        timeOverlay.style.background = "transparent";
        timeOverlay.style.backdropFilter = "none";

        timeIndicator.textContent = "☀️ Día";

    }

    else if(hour >= 18 && hour < 20){

        timeOverlay.style.background =
        "rgba(255,170,80,.05)";

        timeOverlay.style.backdropFilter =
        "saturate(1.08)";

        timeIndicator.textContent = "🌅 Atardecer";

    }

    else{

        timeOverlay.style.background =
        "rgba(15,35,70,.08)";

        timeOverlay.style.backdropFilter =
        "brightness(.88) saturate(.90)";

        timeIndicator.textContent = "🌙 Noche";

    }

}

// =========================
// AUDIO AMBIENTAL
// =========================

const windAudio = new Audio("assets/wind.mp3");
const birdsAudio = new Audio("assets/birds.mp3");
const soundButton = document.getElementById("soundToggle");

windAudio.loop = true;
birdsAudio.loop = true;

windAudio.volume = 0.25;
birdsAudio.volume = 0.15;

let ambienceStarted = false;
let ambienceMuted = false;

const yachay = document.getElementById("yachay");

const leftEye = document.querySelector(".left-eye");
const rightEye = document.querySelector(".right-eye");

const eyeHeight = 26;

function startAmbience() {

    if (ambienceStarted) return;

    ambienceStarted = true;

    Promise.all([
        windAudio.play(),
        birdsAudio.play()
    ]).catch(error => {

        console.log("El navegador bloqueó el audio automático.", error);

    });

}

soundButton.addEventListener("click", () => {

    if(!ambienceStarted){

        startAmbience();

        soundButton.textContent="🔊";

        return;

    }

    if(ambienceMuted){

        windAudio.play();
        birdsAudio.play();

        ambienceMuted=false;

        soundButton.textContent="🔊";

    }else{

        windAudio.pause();
        birdsAudio.pause();

        ambienceMuted=true;

        soundButton.textContent="🔇";

    }

});

//-------------------------------------
// SEGUIR CURSOR
//-------------------------------------

document.addEventListener("mousemove",(e)=>{

const rect=yachay.getBoundingClientRect();

const centerX = rect.left + rect.width / 2;
const centerY = rect.top + rect.height / 2;


const mouseX = e.clientX;
const mouseY = e.clientY;


let x = mouseX - centerX;
let y = mouseY - centerY;


const distance = Math.sqrt(x*x + y*y);


if(distance > 0){

x = (x / distance) * 10;
y = (y / distance) * 10;

}


leftEye.style.transform=`translate(${x}px,${y}px)`;

rightEye.style.transform=`translate(${x}px,${y}px)`;


});

//-------------------------------------
// PARPADEO
//-------------------------------------

function blink(){

leftEye.style.height="3px";
rightEye.style.height="3px";

setTimeout(()=>{

leftEye.style.height=eyeHeight+"px";
rightEye.style.height=eyeHeight+"px";

},140);

}

function randomBlink(){

const t=Math.random()*4000+3000;

setTimeout(()=>{

blink();

randomBlink();

},t);

}

randomBlink();

//-------------------------------------
// HOVER
//-------------------------------------

yachay.addEventListener("mouseenter",()=>{

yachay.style.transform="translateY(-5px) scale(1.06)";

});

yachay.addEventListener("mouseleave",()=>{

yachay.style.transform="translateY(0px) scale(1)";

});
//-------------------------------------
// SALUDO SEGÚN LA HORA
//-------------------------------------

const hour = new Date().getHours();

let greeting = "";

if(hour >= 5 && hour < 12){

    greeting = "🌞 ¡Buenos días!";

}else if(hour >= 12 && hour < 19){

    greeting = "☀️ ¡Buenas tardes!";

}else{

    greeting = "🌙 ¡Buenas noches!";

}

document.querySelector(".speech-content").innerHTML = `

<strong>${greeting}</strong><br><br>

Soy <strong>Yachay</strong>, tu guía especializado en los saberes ancestrales de Tungurahua.

<br><br>

¿Cómo puedo ayudarte hoy?

`;

document.querySelector(".bot-message").innerHTML = `

${greeting} 👋

<br><br>

Soy <strong>Yachay</strong>.

Estoy listo para responder preguntas sobre los saberes ancestrales de Tungurahua.

`;
//-------------------------------------
// BURBUJA DE BIENVENIDA
//-------------------------------------

const speech = document.getElementById("speech");

setTimeout(() => {

    speech.classList.add("show");

},2000);

setTimeout(() => {

    speech.classList.remove("show");

},9000);

// Si hacen clic en Yachay,
// la burbuja desaparece inmediatamente.

yachay.addEventListener("click",()=>{

speech.classList.remove("show");

});
//-------------------------------------
// CHAT
//-------------------------------------

const chat =
document.getElementById("chat-window");

let opened=false;

yachay.addEventListener("click",()=>{

opened=!opened;

if(opened){

chat.classList.add("show");

}else{

chat.classList.remove("show");

}

});
//-------------------------------------
// MENSAJES
//-------------------------------------

const input = document.getElementById("user-input");
const send = document.getElementById("send");
const messages = document.getElementById("messages");


function addUserMessage(text){

const div=document.createElement("div");

div.className="user-message";

div.innerHTML=text;

messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

}


function addBotMessage(text){

const div=document.createElement("div");

div.className="bot-message";

div.innerHTML=text;

messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

}


//-------------------------------------
// ESCRIBIENDO...
//-------------------------------------

function showTyping(){

const div=document.createElement("div");

div.className="typing";

div.id="typing";

div.innerHTML=`

<span></span>
<span></span>
<span></span>

`;

messages.appendChild(div);

messages.scrollTop=messages.scrollHeight;

}


function hideTyping(){

const typing=document.getElementById("typing");

if(typing){

typing.remove();

}

}


//-------------------------------------
// ENVIAR MENSAJE
//-------------------------------------

function sendMessage(){

const text=input.value.trim();

if(text==="") return;


addUserMessage(text);

input.value="";

showTyping();

fetch("https://yachay-production.up.railway.app/chat",{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

message:text

})

})

.then(res=>res.json())

.then(data=>{

console.log("Respuesta del backend:", data);

hideTyping();

addBotMessage(data.answer);

})


.catch(error=>{
    
hideTyping();

addBotMessage("❌ Error al conectar con Yachay.");

console.error(error);

});

}


send.addEventListener("click",sendMessage);


input.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});

document.addEventListener("click", startAmbience, { once: true });

updateEnvironment();

setInterval(updateEnvironment,60000);