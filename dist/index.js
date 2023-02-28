"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icon = void 0;
const node_stream_1 = require("node:stream");
const fs_1 = require("fs");
const node_path_1 = __importDefault(require("node:path"));
const svgo_1 = require("svgo");
const case_1 = __importDefault(require("case"));
const is_svg_1 = __importDefault(require("is-svg"));
class Icon {
    constructor(sourceFilePath, options = {}) {
        this.nameCase = "kebab";
        this.sourceDirPath = "";
        this.sourceFilePath = "";
        this.content = "";
        if (node_path_1.default.parse(sourceFilePath).ext !== ".svg") {
            throw new Error(`${sourceFilePath} is not correct svg file path`);
        }
        this.sourceFilePath = sourceFilePath;
        if (options.nameCase) {
            this.nameCase = options.nameCase;
        }
        if (options.sourceDirPath) {
            this.sourceDirPath = options.sourceDirPath;
            this.name = case_1.default[this.nameCase](node_path_1.default.relative(this.sourceDirPath, this.sourceFilePath).slice(0, -4));
        }
        else {
            this.name = case_1.default[this.nameCase](node_path_1.default.parse(this.sourceFilePath).name);
        }
    }
    optimize() {
        if (!this.content) {
            throw new Error("content is not set yet");
        }
        this.content = (0, svgo_1.optimize)(this.content).data;
        return this;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = yield fs_1.promises.readFile(this.sourceFilePath, "utf8");
            if (!(0, is_svg_1.default)(content)) {
                throw new Error(`${this.sourceFilePath} file content is not valid svg`);
            }
            this.content = content;
            return this;
        });
    }
    getGlyph(options) {
        return Object.assign(node_stream_1.Readable.from([this.content]), options);
    }
}
exports.Icon = Icon;
