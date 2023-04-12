/// <reference types="node" />
import type { Case } from "./types";
import { Readable } from "node:stream";
import { type Config } from "svgo";
export interface Options {
    case: Case;
    sourceDirPath: string;
}
export declare class Icon {
    options: Options;
    name: string;
    sourceFilePath: string;
    content: string;
    constructor(sourceFilePath: string, options?: Partial<Options>);
    optimize(config?: Config): this;
    read(): Promise<this>;
    getGlyph(options: object): Readable;
}
