import * as path from "path";
import * as fs from "mz/fs";
import config from "./config";
import { PathLike } from "mz/fs";

const inflect = require("i")(true);

export function copyFile(src: PathLike, dst: PathLike) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(src)
      .pipe(fs.createWriteStream(dst))
      .on("close", (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
  });
}

export function relaceContent(target: string, path: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", function(err, data) {
      if (err) {
        reject(err);
      } else {
        let content = data.toString().replace(/\$name/g, target);
        fs.writeFile(path, content, function(err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      }
    });
  });
}

// 复制生成模板
export async function copyFolder(src: string, dst: string, name: string) {
  let stats = await fs.stat(dst).catch(e => undefined);
  if (stats && !stats.isDirectory()) {
    throw Error("not folder");
  }

  await fs.mkdir(dst);
  await Promise.all(
    (await fs.readdir(src)).map(async file => {
      let source = path.join(src, file);
      let target = path.join(dst, file);

      let stats = await fs.stat(source);

      if (stats.isDirectory()) {
        await copyFolder(source, target, name);
      } else if (stats.isFile()) {
        await copyFile(source, target);
        if (name.length > 0) {
          await relaceContent(inflect.camelize(name), target);
        }
      }
    })
  );
}

// 检查templates文件夹是否存在
export async function checkTemplatesFolder(context: any) {
  if (!(await fs.exists(config.templatesFolderPath))) {
    await copyFolder(
      path.join(context.extensionPath, "templates"),
      config.templatesFolderPath,
      ""
    );
  }

  if (!(await fs.exists(config.reducerTemplatesFolderPath))) {
    await copyFolder(
      path.join(context.extensionPath, `templates${path.sep}page`),
      config.reducerTemplatesFolderPath,
      ""
    );
  }

  if (!(await fs.exists(config.actionTemplatesFolderPath))) {
    await copyFolder(
      path.join(context.extensionPath, `templates${path.sep}action`),
      config.actionTemplatesFolderPath,
      ""
    );
  }

  return (
    (await fs.exists(config.templatesFolderPath)) &&
    (await fs.exists(config.reducerTemplatesFolderPath)) &&
    fs.exists(config.actionTemplatesFolderPath)
  );
}

// 文件夹是否已存在
export async function checkFolderIsExits(name: string) {
  return await fs.exists(name);
}

// 生成文件夹路径
export async function generateFolderPath(name: string, type: string, uri: any) {
  let foldername = name + "_" + type;
  let pathname = "";
  let stat = await fs.stat(uri.path);
  if (stat.isDirectory()) {
    pathname = `${uri.path}${path.sep}${foldername}`;
  } else {
    pathname = `${path.dirname(uri.path)}${path.sep}${foldername}`;
  }
  return pathname;
}
