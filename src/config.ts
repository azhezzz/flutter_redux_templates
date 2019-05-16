import * as path from "path";
import * as os from "os";
const json = require("../package.json");

export class Config {
  public get templatesFolderPath(): string {
    return path.join(
      os.homedir(),
      `.vscode${path.sep}jupiter-templates_${json.version}`
    );
  }

  public get reducerTemplatesFolderPath(): string {
    return path.join(this.templatesFolderPath, `${path.sep}reducer`);
  }

  public get actionTemplatesFolderPath(): string {
    return path.join(this.templatesFolderPath, `${path.sep}action`);
  }
}

export default new Config();
