const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url === '/') {
        // res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><head><ttle> Enter Message </title></head>')
        res.write('<body><form action="/message" method="POST">');
        res.write('<input type="text" name="message"><button type="submit">Send</button>');
        res.write('</form></body></html>');
        return res.end();
    } 
    if (url === '/message' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            console.log(chunk);
            body.push(chunk);
        });
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];

            fs.writeFileSync('message.txt', message, (err) => {
                console.error(err);
                res.writeHead(302, { 'Location': '/' });
                return res.end();
            });
        });
    } 
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html>');
    res.write('<head><title> My First Page </title></head>');
    res.write('<body><h1> Hello from my Node.JS Server!</h1></body>');
    res.write('</html>');
    res.end();
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
