declare class EventEmitter {
    callbacks: any;
    constructor();
    on(_names: string, callback: Function): this | false;
    off(_names: string): this | false;
    trigger(_name: string, _args?: any[]): any;
    resolveNames(_names: string): string[];
    resolveName(name: string): any;
}

export default EventEmitter;