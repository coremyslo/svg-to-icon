# @coremyslo/svg-to-icon [![npm](https://img.shields.io/npm/v/@coremyslo/svg-to-icon)](https://www.npmjs.com/package/@coremyslo/svg-to-icon) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/coremyslo/svg-to-icon/blob/master/LICENSE)

This module represents a helper class for reading and optimizing SVG files, returning their name based on path and file content, and generating glyphs
## Installation

```shell
$ yarn add @coremyslo/svg-to-icon
```


## Usage
```typescript
import { Icon } from "@coremyslo/svg-to-icon";

const pathToFile = path.join(__dirname, "./assets/icons/icon-home.svg")
const icon = new Icon(pathToFile);

console.log(icon.name) // returns "icon-home"

await icon.read();
console.log(icon.content) // returns file's content as a string

icon.optimize();
console.log(icon.content) // returns optimized file content as a string
```
### Usage for icon font generation
The following example is based on [svgicons2svgfont](https://www.npmjs.com/package/svgicons2svgfont)
```typescript
// ...

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
console.log((await getFontStream([glyph])).toString());


/* will log

<?xml version="1.0" standalone="no"?>
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

*/
```

## API
### new Icon(sourceFilePath, options)
* `sourceFilePath: string`

Absolute path to the icon file
* `options: object`
  * `case: "snake" | "pascal" | "camel" | "kebab" | "header" | "constant"` - optional, define case for icon name, see [case](https://www.npmjs.com/package/case) package for details.
    ```typescript
    import { Icon } from "@coremyslo/svg-to-icon";

    const pathToFile = path.join(__dirname, "./assets/icons/icon-home.svg")
    const icon = new Icon(pathToFile, { case: "camel" });
    console.log(icon.name) // logs "iconHome"
    ```
  * `sourceDirPath: string` - optional, absolute path to root folder for icon. If not set, only the filename of the icon will be considered as the name of the icon.
    ```typescript
    import { Icon } from "@coremyslo/svg-to-icon";

    const pathToFile = path.join(__dirname, "./assets/icons/icon-home.svg")
    const icon = new Icon(pathToFile, { sourceDirPath: "/assets/" });
    console.log(icon.name) // logs "icons-icon-home"
    ```
### `read(): Promise<this>`
Asynchronously reads the file specified by the sourceFilePath parameter passed to the constructor.

### `optimize(): this`
Synchronously rewrites `icon.content` with the optimized version of the SVG, using the [svgo](https://www.npmjs.com/package/svgo) package.

### `getGlyph(options): Readable`
Returns a node `Readable` stream object.
* `options: object` options passed to node's [Readable.from](https://nodejs.org/api/stream.html#streamreadablefromiterable-options) under the hood. This method is used to generate a glyph from the SVG icon.

### `content: string`
* Contains the file content after `read()` has been executed.
### `name: string`
* Contains the name based on the file name and root folder if `sourceDirPath` was passed to the constructor.
