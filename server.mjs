import WebSocket from 'ws'
import jwt from 'jsonwebtoken'

const wss = new WebSocket.Server({ port: 3000 })

const secret = 'secret'

const users = [
  {
    name: 'jose',
    password: 1234
  }
]

function eventMiddlewareManager (message) {
  try {
    var event = JSON.parse(message)
    console.log('event', event)

    eventMiddlewareManager.middleware[event.type] &&
    eventMiddlewareManager.middleware[event.type].map((middleware, message) => {
      console.log('middleware', middleware, 'message', message)
    })
    this.emit(event.type, event.payload)
  } catch (err) {
    console.log('not an event', err)
  }
}

eventMiddlewareManager.middleware = {}
eventMiddlewareManager.use = (event, middleware) => {
  eventMiddlewareManager.middleware[event] = eventMiddlewareManager.middleware[event] || []
  eventMiddlewareManager.middleware[event].push(middleware)
}

eventMiddlewareManager.use('postMessage', checkAuthorization)

function checkAuthorization (data, ws) {
  const authorized = jwt.verify(data.token, secret, function (error, decoded) {
    if (error) {
      console.log('JWT verify error: ', error)
      ws.emit('error', 'Not authenticated')
      return false
    } else {
      console.log(`Token received: Name: ${decoded.name}, password: ${decoded.password}`)
      return true
    }
  })
  return authorized
}

wss.on('connection', function connection (ws) {
  console.log('Connection received')

  ws.on('message', eventMiddlewareManager)
    .on('postMessage', function incoming (data) {
      console.log('postMessage data', data)
      if (checkAuthorization(data, ws)) {
        ws.send(JSON.stringify({ type: 'message', payload: data.text }))
      }
    })
    .on('getToken', function getToken (data) {
      console.log('Asking for token')

      function getUser (data) {
        return users.find(user => {
          return user.name === data.user
        })
      }

      function createToken (data) {
        const token = jwt.sign(getUser(data), secret)
        console.log('token Created')
        return token
      }

      getUser(data)
        ? ws.send(JSON.stringify({ type: 'token', payload: createToken(data) }))
        : ws.emit('error', 'User does not exist')
    })

  ws.on('error', errorMessage => {
    console.log('Websocket error', errorMessage)
    ws.send(JSON.stringify({ type: 'error', payload: errorMessage }))
  })

  ws.on('close', () => console.log('Connection closed'))
})
