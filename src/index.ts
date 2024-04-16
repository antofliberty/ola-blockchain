import express, {Request, Response} from 'express';
import {Blockchain} from "./blockchain";
import { Net } from "./net";
import {syncChain} from "./chain";

const app = express();

const DEFAULT_PORT = 4000
export const APP_PORT: number = parseInt(process.env.APP_PORT || '4000');

app.use(express.json());

const blockchain: Blockchain = new Blockchain()


const ps: Net = new Net({ blockchain })

setTimeout(async () => {
    await ps.broadcastChain()
}, 1000)


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
});

app.get('/api/blocks', (req: Request, res: Response) => {
    res.json(blockchain.chain)
});

app.post('/api/mine', (req: Request, res: Response) => {
    const { data } = req.body

    blockchain.pushBlock({data})
    // res.json({ success: true })
    res.json(blockchain.chain)
    // res.redirect('/api/blocks');
});

startServer(APP_PORT)

function startServer(port: number) {
    app.listen(port, () => {
        console.log(`Blockchain web listening at http://localhost:${port}`);
        if (APP_PORT !== DEFAULT_PORT) {
            if(syncChain(blockchain)) {
                console.log('Sync success')
            }
        }
    }).on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use, trying next available port...`);
            startServer(port + 1);
        } else {
            console.error(err);
        }
    });
}

