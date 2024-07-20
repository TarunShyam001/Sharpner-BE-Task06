const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;
    const body = [];

    if (url === '/') {
        fs.readFile("message.txt", {encoding : "utf-8"}, (err, data)=>{
            if(err){
                console.log(err);
            }
            console.log(`data frm the user : ${data}`)

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<html><head><title> Enter a Message </title></head>')
            res.write(`<body> ${data} </body>`)
            res.write('<body><form action="/message" method="POST">');
            res.write('<input type="text" name="message"><button type="submit">Send</button>');
            res.write('</form></body></html>');
            return res.end();
        });
    } else if (url === '/message' && method === 'POST') {
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();  // stores as the input name i.e. message="input+values%taskId"
            console.log(parsedBody);
            const message = parsedBody.split('=')[1];  // it is used to store the second element of parsed body after splitting in by '=' character. 
            console.log(message);
            fs.writeFile('message.txt', message, err => {
                if(err){
                    console.log(err);
                }
                console.error(`indises fs.writefile`);
                res.statusCode = 302;
                res.setHeader("Location","/")
                return res.end();
            });
        });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html>');
        res.write('<head><title> My First Page </title></head>');
        res.write('<body><h1> Hello from my Node.JS Server!</h1></body>');
        res.write('</html>');
        res.end();
    }
});

const PORT = 4200;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
