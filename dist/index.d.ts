/// <reference types="node" />
import type { Case } from "./types";
import { Readable } from "node:stream";
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
    optimize(): this;
    read(): Promise<this>;
    getGlyph(options: object): Readable;
}
