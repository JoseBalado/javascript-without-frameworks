// Main javascript file for the SPA

const ws = new window.WebSocket('ws://127.0.0.1:3000')

let jwtAccessToken = ''

ws.onopen = function () {
  console.log('Connection established')
}

// Websocket events section
const events = {
  error: new window.Event('error'),
  token: new window.Event('token'),
  message: new window.Event('message')
}

function toEvent (message) {
  try {
    console.log('Message: ', message)
    const data = JSON.parse(message.data)
    events[data.type].payload = data.payload
    document.dispatchEvent(events[data.type])
  } catch (err) {
    console.log('not an event', err)
  }
}

ws.onmessage = toEvent

document.addEventListener('error', event =>
  console.log('Error event received: ', event)
)

document.addEventListener('token', event => {
  console.log('Token received, user authenticated: ', event)
  jwtAccessToken = event.payload
})

document.addEventListener('message', event => {
  console.log('Message received: ', event)
  printMessage(event.payload)
})

// Data handlers section
const handlers = {
  getToken: getToken,
  sendMessage: sendMessage
}

document.querySelectorAll('[data-handler]')
  .forEach(elem =>
    elem.addEventListener(elem.dataset.event, handlers[elem.dataset.handler])
  )

function getToken () {
  const message = {
    type: this.dataset.type,
    payload: {
      user: document.getElementById('userName').value
    }
  }

  ws.send(JSON.stringify(message))
}

function sendMessage () {
  const message = {
    type: this.dataset.type,
    payload: {
      token: jwtAccessToken,
      text: document.getElementById('msgBox').value
    }
  }

  ws.send(JSON.stringify(message))
}

// View section
function printMessage (message) {
  const msgDiv = document.createElement('div')
  msgDiv.innerHTML = `${message}`
  document.getElementById('messages').appendChild(msgDiv)
}
