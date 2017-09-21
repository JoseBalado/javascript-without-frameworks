import WebSocket from 'ws'
import jwt from 'jsonwebtoken'

const wss = new WebSocket.Server({ port: 3000 })

const users = [{
  name: 'Jose',
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

wss.on('connection', function connection (ws, unknown) {
  ws.on('message', toEvent)
    .on('authenticate', function incoming (data) {
      const options = {}
      console.log('data', data)
      jwt.verify(data.token, options, function (err, decoded) {
        if (err) {
          console.log(err)
        }
        console.log(`received: "${decoded}"`)
        ws.send(decoded)
      })
    })
    .on('getToken', function getToken () {
      console.log('Asking for token')
    })
  console.log('Connection received')

  ws.on('close', function () {
    console.log('Someone closed the connection')
  })
})
