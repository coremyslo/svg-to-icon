import type { Case } from "./types";
import { Readable } from "node:stream";
import { promises as fsp } from "fs";
import path from "node:path";
import { type Config, optimize as svgoOptimize } from "svgo";
import toCase from "case";
import isSVG from "is-svg";

export interface Options {
    case: Case;
    sourceDirPath: string;
}

export class Icon {
    public options: Options = {
        case: "kebab",
        sourceDirPath: "",
    };

    public name: string;

    public sourceFilePath = "";

    public content = "";

    public constructor (sourceFilePath: string, options: Partial<Options> = {}) {
        if (path.parse(sourceFilePath).ext !== ".svg") {
            throw new Error(`${sourceFilePath} is not correct svg file path`);
        }
        this.sourceFilePath = sourceFilePath;
        this.options = { ...this.options, ...options };
        if (options.sourceDirPath) {
            this.name = toCase[this.options.case](path.relative(this.options.sourceDirPath, this.sourceFilePath).slice(0, -4));
        } else {
            this.name = toCase[this.options.case](path.parse(this.sourceFilePath).name);
        }
    }

    public optimize (config: Config = { plugins: ["preset-default", "removeDimensions"] }): this {
        if (!this.content) {
            throw new Error("content is not set yet");
        }
        this.content = svgoOptimize(this.content, config).data;

        return this;
    }

    public async read (): Promise<this> {
        const content = await fsp.readFile(this.sourceFilePath, "utf8");
        if (!isSVG(content)) {
            throw new Error(`${this.sourceFilePath} file content is not valid svg`);
        }
        this.content = content;

        return this;
    }

    public getGlyph (options: object): Readable {
        return Object.assign(Readable.from([this.content]), options);
    }
}
