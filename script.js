const yachay = document.getElementById("yachay");

const leftEye = document.querySelector(".left-eye");
const rightEye = document.querySelector(".right-eye");

const eyeHeight = 26;

//-------------------------------------
// SEGUIR CURSOR
//-------------------------------------

document.addEventListener("mousemove",(e)=>{

const rect=yachay.getBoundingClientRect();

const centerX=rect.left+rect.width/2;
const centerY=rect.top+rect.height/2;

const angle=Math.atan2(

e.clientY-centerY,
e.clientX-centerX

);

const distance=10;

const x=Math.cos(angle)*distance;
const y=Math.sin(angle)*distance;

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

}
send.addEventListener("click",sendMessage);

input.addEventListener("keydown",(e)=>{

if(e.key==="Enter"){

sendMessage();

}

});