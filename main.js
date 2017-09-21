// Main javascript file for the SPA

const ws = new WebSocket('ws://127.0.0.1:3000')

let jwtAccessToken = ''

const handlers = {
  getToken: getToken
}

const events = {
  token: new Event('token')
}

document.addEventListener('token', function (event) {
  console.log('Event received: ', event)
  console.log('Event payload: ', event.payload)
  jwtAccessToken = event.payload
})

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

document.querySelectorAll('[data-handler]')
  .forEach(elem =>
    elem.addEventListener(elem.dataset.event, handlers[elem.dataset.handler])
  )

// ws.onmessage = function (message) {
//   console.log('message', message)
//   const msgDiv = document.createElement('div')
//   msgDiv.innerHTML = message.data
//   document.getElementById('messages').appendChild(msgDiv)
// }

ws.onmessage = toEvent

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
