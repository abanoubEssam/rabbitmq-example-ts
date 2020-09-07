export enum ExchangesTypes {
    DIRECT = "direct",
    FANOUT = "fanout",
    TOPIC = "topic",
    CLUSTER = "cluster"
}


// for direct key example
export const ROUTE_KEY_DIRECT = "direct_route";
export const BINDING_KEY_DIRECT = ROUTE_KEY_DIRECT;

export const DIRECT_EXCHANGE = "direct_exchange"
export const DIRECT_QUEUE = "direct_queue"


// for fanout 
export const FANOUT_EXCHANGE = "fanout_exchange"
export const FANOUT_QUEUE = "fanout_queue"