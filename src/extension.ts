"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as util from "./util";
const fs = require("fs");
import config from "./config";

import { window } from "vscode";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const azheSubscribe = context.subscriptions.push.bind(
    context.subscriptions
  ) as typeof context.subscriptions.push;
  const azheRegisterCommand = (
    command: string,
    callback: (...args: any[]) => any,
    thisArg?: any
  ) =>
    azheSubscribe(vscode.commands.registerCommand(command, callback, thisArg));

  // 创建jupiter reducer模板文件
  azheRegisterCommand("extension.GenerateReducerTemplate", async uri => {
    try {
      await util.checkTemplatesFolder(context);
      let pathname = "";
      window
        .showInputBox({
          password: false,
          ignoreFocusOut: true,
          placeHolder: "Please input reducer name",
          validateInput: async function(text) {
            pathname = await util.generateFolderPath(text, "reducer", uri);
            return (await util.checkFolderIsExits(pathname))
              ? "Oops! Reducer Already Exits"
              : null;
          }
        })
        .then(async function(text) {
          if (!text) {
            return;
          }
          util.copyFolder(config.reducerTemplatesFolderPath, pathname, text);
        });
    } catch (error) {
      vscode.window.showErrorMessage(`Jupiter-Template: ${error.message}`);
    }
  });

  // 创建jupiter action模板文件
  azheRegisterCommand("extension.GenerateActionTemplate", async uri => {
    try {
      await util.checkTemplatesFolder(context);
      let pathname = "";
      window
        .showInputBox({
          password: false,
          ignoreFocusOut: true,
          placeHolder: "Please input action name",
          validateInput: async function(text) {
            pathname = await util.generateFolderPath(text, "action", uri);
            return (await util.checkFolderIsExits(pathname))
              ? "Oops! Action Already Exits"
              : null;
          }
        })
        .then(async function(text) {
          if (!text) {
            return;
          }
          util.copyFolder(config.reducerTemplatesFolderPath, pathname, text);
        });
    } catch (error) {
      vscode.window.showErrorMessage(`Jupiter-Template: ${error.message}`);
    }
  });

  // 打开 templates文件夹
  azheRegisterCommand("extension.OpenJupiterTemplateFolder", async () => {
    try {
      await util.checkTemplatesFolder(context);
      let uri = vscode.Uri.file(config.templatesFolderPath);
      vscode.commands.executeCommand("vscode.openFolder", uri, true);
    } catch (error) {
      vscode.window.showErrorMessage(`Jupiter-Template: ${error.message}`);
    }
  });
}
