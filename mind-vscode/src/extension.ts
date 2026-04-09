import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function getNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

let currentPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  // Status bar item
  const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusItem.text = '🌙 慢 mind';
  statusItem.tooltip = '给自己一段慢时光';
  statusItem.command = 'mind-slow.open';
  context.subscriptions.push(statusItem);
  statusItem.show();

  // Command
  const openCommand = vscode.commands.registerCommand('mind-slow.open', () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Beside);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'mindSlow',
      '慢 mind',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [
          vscode.Uri.joinPath(context.extensionUri, 'media'),
        ],
      }
    );

    currentPanel.webview.html = getWebviewHtml(currentPanel.webview, context.extensionUri);

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });

    currentPanel.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'showInfo':
          vscode.window.showInformationMessage(message.text);
          break;
      }
    });
  });

  context.subscriptions.push(openCommand);
}

function getWebviewHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const nonce = getNonce();
  const htmlPath = path.join(extensionUri.fsPath, 'media', 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf-8');
  html = html.replace(/\$\{nonce\}/g, nonce);
  html = html.replace(/\$\{cspSource\}/g, webview.cspSource);
  return html;
}

export function deactivate() {}
