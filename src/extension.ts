// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as parser from "@babel/parser";
import * as vscode from 'vscode';
import G = require("glob");
const generator = require("@babel/generator");

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

//   // Use the console to output diagnostic information (console.log) and errors (console.error)
//   // This line of code will only be executed once when your extension is activated
//   console.log('Congratulations, your extension "matu0409" is now active!');

//   // The command has been defined in the package.json file
//   // Now provide the implementation of the command with registerCommand
//   // The commandId parameter must match the command field in package.json
//   let disposable = vscode.commands.registerCommand('matu0409.helloWorld', () => {
//     // The code you place here will be executed every time your command is executed
//     // Display a message box to the user
//     vscode.window.showInformationMessage('Hello World from matu0409!');
//   });

//   context.subscriptions.push(disposable);
//   // vscode.CodeAction
// }
export function activate(context: vscode.ExtensionContext) {

  // ast 命令
  context.subscriptions.push(
    vscode.commands.registerCommand("matu0409.ast", () => {

      vscode.window.showInformationMessage("js=>ast");

      vscode.window?.activeTextEditor?.edit(editBuilder => {
        // 从开始到结束，全量替换
        const end = new vscode.Position(vscode.window?.activeTextEditor?.document?.lineCount || 0 + 1, 0);
        const text = parser.parse(vscode.window?.activeTextEditor?.document?.getText().toString() || '')
        editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(text));
        const panel = vscode.window.createWebviewPanel(
          'testWebview', // viewType
          "ast.json", // 视图标题
          vscode.ViewColumn.One, // 显示在编辑器的哪个部位
          {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );
        panel.webview.html = JSON.stringify(text)
      });
    })
  );
  // generator 命令
  context.subscriptions.push(
    vscode.commands.registerCommand("matu0409.generator", () => {

      vscode.window.showInformationMessage("ast=>js");


      vscode.window?.activeTextEditor?.edit(editBuilder => {
        // 从开始到结束，全量替换
        const end = new vscode.Position(vscode.window?.activeTextEditor?.document?.lineCount || 0 + 1, 0);
        const text = generator.default(JSON.parse(vscode.window?.activeTextEditor?.document?.getText().toString() || ''))
        const panel = vscode.window.createWebviewPanel(
          'testWebview', // viewType
          "js_code", // 视图标题
          vscode.ViewColumn.One, // 显示在编辑器的哪个部位
          {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );
        panel.webview.html = (text?.code)
        // editBuilder.replace(new vscode.Range(new vscode.Position(0, 0), end), JSON.stringify(text));
      });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("matu0409.editorTitle", () => {
      vscode.window.showInformationMessage("编译器标题菜单");
      const path = '/Users/somefile.txt';
      const options = {
        // 选中第3行第9列到第3行第17列
        selection: new vscode.Range(new vscode.Position(2, 8), new vscode.Position(2, 16)),
        // 是否预览，默认true，预览的意思是下次再打开文件是否会替换当前文件
        preview: false,
        // 显示在第二个编辑器
        viewColumn: vscode.ViewColumn.Two
      };
      vscode.window.showTextDocument(vscode.Uri.file(path), options);

    })
  );

  // 资源右键菜单的回调可以拿到当前点击和所有选中的 Uri 信息(通过命令触发则没有)
  // clickFileUrl: 当前选中的 Uri 信息
  // filePaths: 所欲选中的 Uri 信息
  context.subscriptions.push(
    vscode.commands.registerCommand("matu0409.explorerContext", (clickFileUrl: vscode.Uri, filePaths: vscode.Uri[]) => {
      vscode.window.showInformationMessage("资源右键菜单");
      if (Array.isArray(filePaths)) {
        // "\n" + 路径 拼成字符串
        const msg = filePaths.map(url => ("\n" + url.fsPath)).join("");
        vscode.window.showInformationMessage("选中的文件路径: " + msg);
        const panel = vscode.window.createWebviewPanel(
          'testWebview', // viewType
          "WebView演示", // 视图标题
          vscode.ViewColumn.One, // 显示在编辑器的哪个部位
          {
            enableScripts: true, // 启用JS，默认禁用
            retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
          }
        );
        panel.webview.html = `<html><body>你好，我是Webview</body></html>`
      }
    })
  );

}





// This method is called when your extension is deactivated
export function deactivate() {
  vscode.window.showInformationMessage('goodbye my vscode');
}

