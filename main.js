// Main javascript file for the SPA

const ws = new WebSocket('ws://127.0.0.1:3000')

const handlers = {
  getToken: getToken
}

document.querySelectorAll('[data-handler]')
  .forEach(elem =>
    elem.addEventListener(elem.dataset.event, handlers[elem.dataset.handler])
  )

ws.onmessage = function (message) {
  const msgDiv = document.createElement('div')
  msgDiv.innerHTML = message.data
  document.getElementById('messages').appendChild(msgDiv)
}

ws.onopen = function () {
  console.log('Connection established')
}

function getToken (event) {
  const message = {
    type: this.dataset.type,
    payload: {
      user: document.getElementById('msgBox').value
    }
  }

  ws.send(JSON.stringify(message))
}
