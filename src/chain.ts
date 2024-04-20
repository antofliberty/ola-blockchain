import {Blockchain} from "./blockchain"
import {Block} from "./block"
// import {APP_PORT} from "./index";

const ROOT_NODE_URL = `http://localhost:${4000}`

export function syncChain(blockchain: Blockchain): boolean {
    fetch(`${ROOT_NODE_URL}/api/blocks`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(res =>  {
        const newChain: Block[] = res as Block[]

        if(!blockchain.replaceChain(newChain)) {
            throw new Error('Chain has not been replaced')
        }
    }).catch(err => {
        throw new Error(`Sync failed: Request error: ${err}`)
    })

    return true
}
