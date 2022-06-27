let container = document.querySelector(".container")
let background = document.querySelector(".background")
let sideMenu = document.querySelector(".menu")
let user = {};
let messages;
let objectMessage;
let toUserName = "Todos";
let visibility;
let activeUsers;

function welcome(){
  user.name = document.querySelector(".welcome1 > input").value;
  if ((user.name).toUpperCase() === "TODOS"){
    alert(
      `Tá de sacanagem, né? Você não pode escolher o nome "TODOS". :(\nPor gentileza, escolha um outro nome de usuário.`)
      return
  } else {
    const promiseWelcome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
    promiseWelcome.then(welcomeSuccess);
    promiseWelcome.catch(welcomeError);
  }
}

  function welcomeSuccess(){
    setTimeout(appearLoading, 500);
    setTimeout(appearWelcome, 2000);
    setTimeout(() => document.querySelector(".welcomeMenu").classList.add("hidden"), 3500)
    setInterval(connectionStatus, 5000);
    searchMessages();
    setInterval(searchMessages, 3000);
    searchUsers();
    setInterval(searchUsers, 10000);
    sendWithEnter()
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
      } else if (messages[i].type === "private_message" && (messages[i].to === user.name || messages[i].to === "Todos" || messages[i].from === user.name)){
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

  function reloadUsers(success){
    let userContainer = document.querySelector(".usersContainer")
    let userMenu = document.querySelector(".messageType");
    let userChecked = userMenu.querySelector(".check").parentNode.querySelector("span").innerHTML;
    activeUsers = success.data
    userContainer.innerHTML = null
    for(let i = 0; i < activeUsers.length; i++){
      if (userChecked === activeUsers[i].name){
        userContainer.innerHTML += `
        <div class="users" onclick="toggleCheck(this)">
          <div>
            <ion-icon name="person-circle"></ion-icon>
            <span>${activeUsers[i].name}</span>
          </div>
          <ion-icon name="checkmark" class="hidden check"></ion-icon>
        </div>`

      } else {
        userContainer.innerHTML += `
        <div class="users" onclick="toggleCheck(this)">
          <div>
            <ion-icon name="person-circle"></ion-icon>
            <span>${activeUsers[i].name}</span>
          </div>
          <ion-icon name="checkmark" class="hidden"></ion-icon>
        </div>`
      }
    }
    checkTodos()
  }

  function checkTodos(){
    let userMenu = document.querySelector(".messageType");
    let allUsers = userMenu.querySelectorAll(".check")
    let todos = document.querySelector(".all").querySelector(".hidden")
    if(allUsers.length === 0){
      todos.classList.add("check")
     }
  }

function toggleCheck(element){
  let messageType = document.querySelector(".messageType");
  let isCheckMessage = messageType.querySelector(".check");
  let menuSection = element.parentNode;
  let thisCheck = element.querySelector(".hidden");
  let isCheck = menuSection.querySelector(".check");
  if (menuSection.classList.contains("visibilityType")){
    if (isCheck !== null){
      isCheck.classList.remove("check")
      thisCheck.classList.add("check")
    }
    switchUsers()
  }
  if (menuSection.classList.contains("messageType") || menuSection.classList.contains("usersContainer")){
    if (isCheckMessage !== null){
      isCheckMessage.classList.remove("check")
      thisCheck.classList.add("check")
    }
    switchUsers()
  }
}

function switchUsers(){
  toUserName = document.querySelector(".messageType").querySelector(".check").parentNode.querySelector("span").innerHTML;
  visibility = document.querySelector(".visibilityType").querySelector(".check").parentNode.querySelector("span").innerHTML;
  let footerText = document.querySelector(".interna > p");
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
    return objectMessage;
  } else {
    objectMessage = {
      from: user.name,
      to: toUserName,
      text: document.querySelector("textarea").value,
      type: "message"
    }
    return objectMessage;
  }
}

function sendMessages(){
  searchUsers()
  const promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objectCreator())
  promise.then(searchMessages)
  promise.catch(error => {
    const statusCode = error.response.status;
    if (statusCode === 400){
      alert("Ocorreu um erro inesperado. Você tentou enviar uma mensagem vazia ou o destinatário não se encontra mais na sala. :(\nA página será recarregada. Por favor, faça o login novamente.")
      window.location.reload()
    }
  })
  document.querySelector("textarea").value = null;
}

function sendWithEnter(){
  let input = document.querySelector(".interna > textarea");
  input.addEventListener('keypress', function(e){
    if (13 === e.keyCode){
      e.preventDefault();
      sendMessages();
    }
  })
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