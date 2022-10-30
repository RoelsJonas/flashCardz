export interface IPugEngineConfig {
    templateDir: string;
    pretty?: boolean;
}
export declare function pugEngine(conf: IPugEngineConfig): (maildata: any, cb: (err?: any) => void) => void;
