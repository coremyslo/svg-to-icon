import { Icon } from "../src";
import path from "path";
import SVGIcons2SVGFontStream from "svgicons2svgfont";
import type { Readable } from "node:stream";

// "snake" | "pascal" | "camel" | "kebab" | "header" | "constant"

const correctFileContentPath = path.join(__dirname, "./assets/icons/icon-home.svg");
const correctFileContent = "<svg xmlns=\"http://www.w3.org/2000/svg\" height=\"48\" width=\"48\"><path d=\"M11 39h7.5V26.5h11V39H37V19.5L24 9.75 11 19.5Zm-3 3V18L24 6l16 12v24H26.5V29.5h-5V42Zm16-17.65Z\"/></svg>\n";
const correctFontFileContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
<defs>
  <font id="iconFont" horiz-adv-x="1024">
    <font-face font-family="iconFont"
      units-per-em="1024" ascent="1024"
      descent="0" />
    <missing-glyph horiz-adv-x="0" />
    <glyph glyph-name="icon-home"
      unicode="&#xE900;"
      horiz-adv-x="1024" d="M235 192H395V459H629V192H789V608L512 816L235 608zM171 128V640L512 896L853 640V128H565V395H459V128zM512 505z" />
  </font>
</defs>
</svg>
`;

test("svg path incorrect", async () => {
    const notSvgFilePath = path.join(__dirname, "./assets/icons/icon-home.txt");
    try {
        const icon = new Icon(notSvgFilePath);
        await icon.read();
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty("message", `${notSvgFilePath} is not correct svg file path`);
    }
});

test("icon name", () => {
    expect((new Icon(correctFileContentPath)).name).toBe("icon-home");
    expect((new Icon(correctFileContentPath, { nameCase: "snake" })).name).toBe("icon_home");
    expect((new Icon(correctFileContentPath, { nameCase: "pascal" })).name).toBe("IconHome");
    expect((new Icon(correctFileContentPath, { nameCase: "kebab" })).name).toBe("icon-home");
    expect((new Icon(correctFileContentPath, { nameCase: "header" })).name).toBe("Icon-Home");
    expect((new Icon(correctFileContentPath, { nameCase: "constant" })).name).toBe("ICON_HOME");
    expect((new Icon(correctFileContentPath, { sourceDirPath: path.join(__dirname, "assets") })).name).toBe("icons-icon-home");
    expect((new Icon(correctFileContentPath, { sourceDirPath: path.join(__dirname, "assets/") })).name).toBe("icons-icon-home");
    expect((new Icon(correctFileContentPath, { sourceDirPath: path.join(__dirname, "/assets") })).name).toBe("icons-icon-home");
    expect((new Icon(correctFileContentPath, { sourceDirPath: path.join(__dirname, "/assets/") })).name).toBe("icons-icon-home");
});

test("icon read", async () => {
    const icon = new Icon(correctFileContentPath);
    await icon.read();
    expect(icon.content).toBe(correctFileContent);
});

test("icon read and optimize", async () => {
    const icon = new Icon(correctFileContentPath);
    await icon.read();
    expect(icon.content).toBe(correctFileContent);
});


test("icon read empty file content", async () => {
    const emptyFileContentPath = path.join(__dirname, "./assets/icons/icon-empty.svg");
    try {
        const icon = new Icon(emptyFileContentPath);
        await icon.read();
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty("message", `${emptyFileContentPath} file content is not valid svg`);
    }
});

test("icon read corrupted file content", async () => {
    const corruptedFileContentPath = path.join(__dirname, "./assets/icons/icon-corrupted.svg");
    try {
        const icon = new Icon(corruptedFileContentPath);
        await icon.read();
    } catch (e) {
        expect(e).toBeInstanceOf(Error);
        expect(e).toHaveProperty("message", `${corruptedFileContentPath} file content is not valid svg`);
    }
});
test("icon glyph", async () => {
    const icon = new Icon(correctFileContentPath);
    await icon.read();
    const unicode = "0xE900";
    const glyph = icon.getGlyph({
        metadata: {
            name: icon.name,
            unicode: [String.fromCharCode(parseInt(unicode, 16))],
        },
    });
    const getFontStream = (glyphs: Readable[]): Promise<Uint8Array> => new Promise(resolve => {
        const chunks: Uint8Array[] = [];
        const fontReadStream = new SVGIcons2SVGFontStream({
            fontName: "iconFont",
            fontHeight: 1024,
            normalize: true,
            round: 1,
            log (): void { },
        }).on("data", (chunk: Uint8Array) => {
            chunks.push(chunk);
        }).on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        fontReadStream.write(glyphs[0]);
        fontReadStream.end();
    });
    expect((await getFontStream([glyph])).toString()).toBe(correctFontFileContent);
});


