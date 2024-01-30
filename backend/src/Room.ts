import { Router, Worker } from "mediasoup/node/lib/types";
import Peer from "./Peer";
import config from "./config";

export default class Room extends Router {
    private peers: Peer[] | undefined

    public static async build(worker: Worker): Promise<Room> {
        const room = await worker.createRouter(config.routerOptions) as Room
        room.peers = []

        return room;
    }
}