let container = document.querySelector(".container")
let background = document.querySelector(".background")
let sideMenu = document.querySelector(".menu")
let user = {};
let otherUsers = [];
let messages;
let objectMessage;

welcome()

function welcome(){
  user.name = prompt("Bem-vindo. Seu nome.")
  //user.name = "Jeff"
  const promiseWelcome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
  promiseWelcome.then(welcomeSuccess);
  promiseWelcome.catch(welcomeError);
}

  function welcomeSuccess(){
    alert(`Seja bem-vindo, ${user.name}!!`);
    setInterval(connectionStatus, 5000);
    searchMessages();
    setInterval(searchMessages, 3000);
    searchUsers();
    setInterval(searchUsers, 10000);
  }

  function welcomeError(){
    alert(
    `${user.name}, esse nome de usuário já existe. :(\nPor gentileza, escolha um outro nome de usuário.`)
    welcome()
  }

function connectionStatus(){
  axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user)
}

function searchMessages(){
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
  promise.then(messagesInDOM);
}

  function messagesInDOM(msgs){
    
    messages = msgs.data;
    container.innerHTML = null
    for(let i = 0; i < messages.length; i++){
      if (messages[i].type === "status"){
        container.innerHTML += `
        <div class="status format">
        <span><en>(${messages[i].time})</en> <strong>${messages[i].from}</strong> ${messages[i].text}</span>
        </div>
        `
      } else if (messages[i].type === "message"){
        container.innerHTML += `
        <div class="message format">
          <span><en>(${messages[i].time})</en> <strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</span>
        </div>
        `
      } else if (messages[i].type === "private_message"){
        container.innerHTML += `
        <div class="private_message format">
          <span><en>(${messages[i].time})</en> <strong>${messages[i].from}</strong> reservadamente para <strong>${messages[i].to}</strong>: ${messages[i].text}</span>
        </div>
        `
      }
    }
    document.querySelector(".container > div:last-child").scrollIntoView();
  }

function searchUsers(){
  const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
  promise.then(reloadUsers);
}

  function reloadUsers(activeUsers){
    let userMenu = document.querySelector(".messageType")
    userMenu.innerHTML = `
    <h2>Escolha um contato para enviar mensagem:</h2>
    <div class="users" onclick="toggleCheck(this)">
      <div>
        <ion-icon name="people"></ion-icon>
        <span>Todos</span>
      </div>
      <ion-icon name="checkmark" class="check"></ion-icon>
    </div>`
    for(let i = 0; i < activeUsers.data.length; i++){
      userMenu.innerHTML += `
    <div class="users" onclick="toggleCheck(this)">
      <div>
        <ion-icon name="person-circle"></ion-icon>
        <span>${activeUsers.data[i].name}</span>
      </div>
      <ion-icon name="checkmark" class="check hidden"></ion-icon>
    </div>`
    } 
  }



function toggleCheck(element){
  let menuSection = element.parentNode;
  let checkMark = element.querySelector(".check")
  let isHidden = menuSection.querySelectorAll(".hidden");
  let totalCheck = menuSection.querySelectorAll(".check");
  if (isHidden.length === totalCheck.length){
    checkMark.classList.remove("hidden")
  } else {
    for(let i = 0; i < totalCheck.length; i++){
      totalCheck[i].classList.add("hidden");
    }
    checkMark.classList.remove("hidden")
  }
  

}


function objectCreator(){
  objectMessage = {
    from: user.name,
    to: "Todos",
    text: document.querySelector("textarea").value,
    type: "message"
  }
}

function sendMessages(){
  let text = document.querySelector("textarea").value
  objectCreator()
  text = "";
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objectMessage)
  promise.then(searchMessages)
  promise.catch(error => window.location.reload())
}


function appearMenu(){
  background.classList.add("transitionOpacity")
  sideMenu.classList.add("transitionMenu")
}

function hiddenMenu(){
  background.classList.remove("transitionOpacity")
  sideMenu.classList.remove("transitionMenu")
}