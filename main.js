// Main javascript file for the SPA

const ws = new WebSocket('ws://127.0.0.1:3000')

const handlers = {
  sendMessage: sendMessage
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

function sendMessage (event) {
  console.log(`This.dataset.arguments: ${this.dataset.arguments}`)
  console.log('This: ', this)
  console.log('Event: ', event)

  const message = `${this.dataset.arguments}: ${document.getElementById('msgBox').value}`
  ws.send(message)
}
