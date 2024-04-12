import { createClient } from 'redis';
import {Blockchain} from "./blockchain";

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};

export class PubSub {
    public publisher;
    public subscriber;
    blockchain: Blockchain

    constructor({ blockchain }: { blockchain: Blockchain }) {
        this.blockchain = blockchain
        this.publisher = createClient({
            url: 'redis://localhost:6379'
        });
        this.subscriber = createClient({
            url: 'redis://localhost:6379'
        });

        this.init().then(() => {
            console.log('PubSub initiated successfully')
        }).catch((error) => {
            throw new Error(error)
        })
    }

    async init() {
        await this.subscriber.connect();
        await this.publisher.connect();

        this.subscriber.on('error', err => console.log('Redis Subscriber Error', err));
        this.publisher.on('error', err => console.log('Redis Publisher Error', err));

        this.subscriber.on('message', (channel, message) => this.handleMessage(channel, message));
        this.publisher.on('message', (channel, message) => this.handleMessage(channel, message));

        await this.subscribeToChannels(Object.values(CHANNELS))

    }

    async subscribeToChannels(channels: string[]): Promise<boolean> {
        for (const channel of channels) {
            await this.subscriber.subscribe(channel, (message) => {
               this.handleMessage(channel, message)
            });
        }

        return true
    }

    async publish(channel: string, message: string) {
        await this.subscriber.unsubscribe(channel).then(async () => {
            await this.publisher.publish(channel, message)
            await this.subscriber.subscribe(channel, () => {})
        })
    }

    handleMessage(channel: string, message: string) {
        console.log(`Received message from channel ${channel}: ${message}`)
    }
    async broadcastChain() {
        console.log('chain broadcasted')

        await this.publish(CHANNELS.BLOCKCHAIN, JSON.stringify(this.blockchain.chain))
    }
}
