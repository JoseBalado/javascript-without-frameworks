import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 3000 })

wss.on('connection', function connection (ws) {
  ws.on('message', function incoming (message) {
    console.log('received: %s', message)
    ws.send(message)
  })
  console.log('Connection received')

  ws.on('close', function () {
    console.log('Someone closed the connection')
  })
})
