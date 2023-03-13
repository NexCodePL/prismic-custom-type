import { existsSync, mkdirSync, writeFileSync } from "fs";
import { extname, dirname } from "path";

export async function mkdirSafe(dir: string) {
    if (!dir) throw new Error("Empty dir passed to mkdirSafe");
    const directory = extname(dir) === "" ? dir : dirname(dir);

    if (existsSync(directory)) return;

    mkdirSync(directory, { recursive: true });
}

export function writeFileSafe(dir: string, content: string | Buffer) {
    mkdirSafe(dir);
    writeFileSync(dir, content);
}
