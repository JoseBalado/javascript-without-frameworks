// Main javascript file for the SPA

const ws = new WebSocket('ws://127.0.0.1:3000')

let jwtAccessToken = ''

ws.onopen = function () {
  console.log('Connection established')
}

// Websocket events section
const events = {
  error: new Event('error'),
  token: new Event('token'),
  message: new Event('message')
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

document.addEventListener('error', function (event) {
  console.log('Error event received: ', event)
})

document.addEventListener('token', function (event) {
  console.log('Token received: ', event)
  jwtAccessToken = event.payload
})

document.addEventListener('message', function (event) {
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

function getToken (event) {
  const message = {
    type: this.dataset.type,
    payload: {
      user: document.getElementById('userName').value
    }
  }

  ws.send(JSON.stringify(message))
}

function sendMessage (event) {
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
