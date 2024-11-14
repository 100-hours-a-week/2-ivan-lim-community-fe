import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

// __dirname을 ESM 방식에서 사용하기 위한 설정
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
    express.static(join(__dirname, '../2-ivan-lim-community-fe/CommunityPage')),
);

app.get('/data.json', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/js/data.json',
        ),
    ); // HTML 파일 응답
});

app.get('/login', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/login.html',
        ),
    ); // HTML 파일 응답
});

app.get('/listInquiry', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/listInquiry.html',
        ),
    );
});

app.get('/addBoard', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/addBoard.html',
        ),
    );
});

app.get('/postEdit', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/postEdit.html',
        ),
    );
});

app.get('/detail', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/detail.html',
        ),
    );
});

app.get('/join', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/join.html',
        ),
    );
});

app.get('/passModi', (req, res) => {
    res.sendFile(
        join(
            __dirname,
            '../2-ivan-lim-community-fe/CommunityPage/html/passModi.html',
        ),
    );
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
