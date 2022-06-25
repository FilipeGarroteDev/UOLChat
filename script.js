let container = document.querySelector(".container")
let background = document.querySelector(".background")
let sideMenu = document.querySelector(".menu")
let user = {};
let otherUsers = [];
let messages;
let objectMessage;
let toUserName;
let visibility;

function welcome(){
  user.name = document.querySelector(".welcome1 > input").value;
  const promiseWelcome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
  promiseWelcome.then(welcomeSuccess);
  promiseWelcome.catch(welcomeError);
}

  function welcomeSuccess(){
    if ((user.name).toUpperCase() === "TODOS"){
      alert(
        `Tá de sacanagem, né? Você não pode escolher o nome "TODOS". :(\nPor gentileza, escolha um outro nome de usuário.`)
        welcome()
    } else {
      setTimeout(appearLoading, 500);
      setTimeout(appearWelcome, 2000);
      setTimeout(() => document.querySelector(".welcomeMenu").classList.add("hidden"), 3500)
      setInterval(connectionStatus, 5000);
      searchMessages();
      setInterval(searchMessages, 3000);
      searchUsers();
      setInterval(searchUsers, 10000);
    }
  }

  function welcomeError(){
    alert(
    `${user.name}, esse nome de usuário já existe. :(\nPor gentileza, escolha um outro nome de usuário.`)
    document.querySelector(".welcome1 > input").value = null;
  }

function appearLoading(){
  let firstWelcome = document.querySelector(".welcome1");
  firstWelcome.classList.add("hidden");
  let loadingGIF = document.querySelector(".gif");
  loadingGIF.classList.remove("hidden");
}

function appearWelcome(){
  let hiddenGIF = document.querySelector(".gif");
  hiddenGIF.classList.add("hidden");
  let showWelcome = document.querySelector(".welcome2");
  let textWelcome = showWelcome.querySelector("p");
  textWelcome.innerHTML = `Seja bem-vindo, ${user.name}!!!`
  showWelcome.classList.remove("hidden");
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
      <ion-icon name="checkmark" class="hidden check"></ion-icon>
    </div>`
    for(let i = 0; i < activeUsers.data.length; i++){
      userMenu.innerHTML += `
    <div class="users" onclick="toggleCheck(this)">
      <div>
        <ion-icon name="person-circle"></ion-icon>
        <span>${activeUsers.data[i].name}</span>
      </div>
      <ion-icon name="checkmark" class="hidden"></ion-icon>
    </div>`
    } 
  }

function toggleCheck(element){
  let menuSection = element.parentNode;
  let thisCheck = element.querySelector(".hidden")
  let isCheck = menuSection.querySelector(".check");
  if (isCheck !== null){
    isCheck.classList.remove("check")
    thisCheck.classList.add("check")
  }
  switchUsers()
}

function switchUsers(){
  toUserName = document.querySelector(".messageType").querySelector(".check").parentNode.querySelector("span").innerHTML;
  visibility = document.querySelector(".visibilityType").querySelector(".check").parentNode.querySelector("span").innerHTML;
  let footerText = document.querySelector("p");
  if (visibility === "Reservadamente"){
    footerText.innerHTML = `Enviando para ${toUserName} (reservadamente)`
  } else {
    footerText.innerHTML = `Enviando para ${toUserName}`
  }
}

function objectCreator(){
  if (visibility === "Reservadamente"){
    objectMessage = {
      from: user.name,
      to: toUserName,
      text: document.querySelector("textarea").value,
      type: "private_message"
    }
  } else {
    objectMessage = {
      from: user.name,
      to: toUserName,
      text: document.querySelector("textarea").value,
      type: "message"
    }
  }
  
}

function sendMessages(){
  objectCreator()
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objectMessage)
  promise.then(searchMessages)
  promise.catch(error => {
    alert("Ocorreu um erro inesperado. Você tentou enviar uma mensagem vazia ou o destinatário não se encontra mais na sala. :(\nA página será recarregada. Por favor, faça o login novamente.")
    window.location.reload()
  })
  document.querySelector("textarea").value = null;
  patternReturn()
  switchUsers()
}

function patternReturn (){
  let publicVisibility = document.querySelector(".visibility > .hidden")
  let privateVisibility = document.querySelector(".visibilityType > .visibility:last-child").querySelector(".hidden")
  publicVisibility.classList.add("check")
  privateVisibility.classList.remove("check")
}


function appearMenu(){
  background.classList.add("transitionOpacity")
  background.classList.add("transitionPosition")
  sideMenu.classList.add("transitionMenu")
}

function hiddenMenu(){
  setTimeout(() => background.classList.remove("transitionPosition"), 300);
  background.classList.remove("transitionOpacity");
  sideMenu.classList.remove("transitionMenu");
}