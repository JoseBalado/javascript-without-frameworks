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
