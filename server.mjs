import WebSocket from 'ws'
import jwt from 'jsonwebtoken'

const wss = new WebSocket.Server({ port: 3000 })

const secret = 'secret'

const users = [{
  name: 'jose',
  password: 1234
}]

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
    .on('authenticate', function incoming (data) {
      console.log('data', data)
      jwt.verify(data.token, secret, function (err, decoded) {
        if (err) {
          console.log(err)
        }
        console.log(`received: "${decoded}"`)
        ws.send(decoded)
      })
    })
    .on('getToken', function getToken (data) {
      console.log('Asking for token')
      data.user === users[0].name
        ? createToken()
        : console.log('User does not exist')

      function createToken () {
        const token = jwt.sign(data.user, secret)
        console.log('token Created')
        // ws.send(JSON.parse({ type: 'token', payload: { token: token } }))
        const message = { type: 'token', payload: token }
        ws.send(JSON.stringify(message))
      }
    })
  console.log('Connection received')

  ws.on('close', function () {
    console.log('Someone closed the connection')
  })
})
