"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
let currentPanel;
function activate(context) {
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
        currentPanel = vscode.window.createWebviewPanel('mindSlow', '慢 mind', vscode.ViewColumn.Beside, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'media'),
            ],
        });
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
function getWebviewHtml(webview, extensionUri) {
    const nonce = getNonce();
    const htmlPath = path.join(extensionUri.fsPath, 'media', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf-8');
    html = html.replace(/\$\{nonce\}/g, nonce);
    html = html.replace(/\$\{cspSource\}/g, webview.cspSource);
    return html;
}
function deactivate() { }
//# sourceMappingURL=extension.js.map