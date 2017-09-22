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

function toEvent (message) {
  try {
    var event = JSON.parse(message)
    this.emit(event.type, event.payload)
  } catch (err) {
    console.log('not an event', err)
  }
}

wss.on('connection', function connection (ws) {
  ws.on('message', toEvent)
    .on('postMessage', function incoming (data) {
      console.log('postMessage data', data)
      jwt.verify(data.token, secret, function (error, decoded) {
        if (error) {
          console.log('JWT verify error: ', error)
          return ws.emit('error', 'Not authenticated')
        } else {
          console.log(`received: "${decoded}"`)
          ws.send(JSON.stringify({ type: 'message', payload: data.text }))
        }
      })
    })
    .on('getToken', function getToken (data) {
      console.log('Asking for token')
      checkUser(data)
        ? createToken(data)
        : ws.emit('error', 'User does not exist')

      function createToken (data) {
        const token = jwt.sign(data.user, secret)
        console.log('token Created')
        const message = { type: 'token', payload: token }
        ws.send(JSON.stringify(message))
      }

      function checkUser (data) {
        return users.find(user => {
          return user.name === data.user
        })
      }
    })

  console.log('Connection received')

  ws.on('error', function (errorMessage) {
    console.log('Websocket error', errorMessage)
    const message = { type: 'error', payload: errorMessage }
    ws.send(JSON.stringify(message))
  })

  ws.on('close', function () {
    console.log('Someone closed the connection')
  })
})
