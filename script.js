let container = document.querySelector(".container")
let background = document.querySelector(".background")
let sideMenu = document.querySelector(".menu")
let user = {};
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

/*function objectCreator(){
  objectMessage = {
    from: user.name,
    text: "",
  }
}

function sendMessages(){
  
}*/





function appearMenu(){
  background.classList.add("transitionOpacity")
  sideMenu.classList.add("transitionMenu")
}

function hiddenMenu(){
  background.classList.remove("transitionOpacity")
  sideMenu.classList.remove("transitionMenu")
}