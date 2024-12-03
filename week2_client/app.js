import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// __dirname을 ESM 방식에서 사용하기 위한 설정
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
    express.static(join(__dirname, '')),
);

app.get('/anim.json', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'js/login/anim.json',
        ),
    );
});

app.get('/login', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/login.html',
        ),
    ); // HTML 파일 응답
});

app.get('/listInquiry', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/listInquiry.html',
        ),
    );
});

app.get('/addBoard', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/addBoard.html',
        ),
    );
});

app.get('/postEdit', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/postEdit.html',
        ),
    );
});

app.get('/detail', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/detail.html',
        ),
    );
});

app.get('/join', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/join.html',
        ),
    );
});

app.get('/memInfoModi', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/memInfoModi.html',
        ),
    );
});

app.get('/passModi', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            'html/passModi.html',
        ),
    );
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
