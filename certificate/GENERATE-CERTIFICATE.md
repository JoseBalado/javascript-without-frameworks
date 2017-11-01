## Generating a Self-Signed Certificate

Generate a self-signed certificate using OpenSSL.

Install OpenSSL in Linux
```
sudo apt-get update
sudo apt-get install openssl
```

### Generate a 2048-bit key:
```
$ openssl genrsa -des3 -passout pass:x -out server.pass.key 2048
```

### Generate private key:
```
$ openssl rsa -passin pass:x -in server.pass.key -out server.key
```

### Remove the key:
```
$ rm server.pass.key
```

### Create CSR:
```
$ openssl req -new -key server.key -out server.csr -subj '/C=IE/ST=Dublin/L=Dublin/O=InflightDublin/OU=Information Technology/CN=ws.inflightdublin.com/emailAddress=myemail@myserver.com' > server.csr
```

### Notes
To get a proper server certificate, the CSR file is all you need.

You can use it to obtain a certificate file from the Certificate Authority.

It is possible to create a self-signed certificate for testing purposes.

### Self-signed certificate:
```
$ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```


### Sample Code of websockets code using certificates

Front-end

```
const ws = new window.WebSocket('wss://127.0.0.1:3000')
```

Back-end
```
import WebSocket from 'ws'
import https from 'https'
import fs from 'fs'

const options = {
  key: fs.readFileSync('certificate/server.key'),
  cert: fs.readFileSync('certificate/server.crt')
}

const app = https.createServer(options).listen(3000)
const wss = new WebSocket.Server({ server: app })
```

Launching http-server with SSL using certificates.

If http-server is serving the front-end files, it is a good idea to use SSL, even if this is not related to getting an secure websocket connection.

npm script in `package.json`
```
"scripts": {
  "start": "http-server -p 8088 -S -C 'certificate/server.crt' -K 'certificate/server.key' & node --experimental-modules server.mjs",
  "debug": "http-server -p 8088 -S -C 'certificate/server.crt' -K 'certificate/server.key' & node --experimental-modules --nolazy --inspect=5858 server.mjs"
},
```
