let background = document.querySelector(".background")
let sideMenu = document.querySelector(".menu")
let user = {};
let messages;

welcome()

function welcome(){
  user.name = prompt("Bem-vindo. Seu nome.")
  const promiseWelcome = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants", user)
  promiseWelcome.then(welcomeSuccess);
  promiseWelcome.catch(welcomeError);
  
}

  function welcomeSuccess(){
    alert(`Seja bem-vindo, ${user.name}!!`);
    setInterval(connectionStatus, 5000);
    searchMessages();
  }

  function welcomeError(){
    alert(
    `${user.name}, esse nome de usuário já existe. :(\nPor gentileza, escolha um outro nome de usuário.`)
    welcome()
  }

  function connectionStatus(){
    const status = axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user)
    console.log("mandei")
    console.log(status)
  }

  function searchMessages(){
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    promise.then(function (msg) {
      messages = msg.data;
      console.log(messages)
    })

  }





function appearMenu(){
  background.classList.add("transitionOpacity")
  sideMenu.classList.add("transitionMenu")
}

function hiddenMenu(){
  background.classList.remove("transitionOpacity")
  sideMenu.classList.remove("transitionMenu")
}