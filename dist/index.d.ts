/// <reference types="node" />
import type { Case } from "./types";
import { Readable } from "node:stream";
export interface IconOptions {
    nameCase: Case;
    sourceDirPath: string;
}
export declare class Icon {
    nameCase: Case;
    sourceDirPath: string;
    name: string;
    sourceFilePath: string;
    content: string;
    constructor(sourceFilePath: string, options?: Partial<IconOptions>);
    optimize(): this;
    read(): Promise<this>;
    getGlyph(options: object): Readable;
}
