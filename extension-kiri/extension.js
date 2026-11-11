const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let currentPanel = undefined;

function panelTitle() {
  return vscode.workspace.getConfiguration('handDrill').get('panelTitle') || 'Hand Drill';
}

function activate(context) {
  const open = vscode.commands.registerCommand('handDrill.open', () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Active);
      return;
    }
    const cfg = vscode.workspace.getConfiguration('handDrill');
    const panel = vscode.window.createWebviewPanel(
      'handDrill',
      panelTitle(),
      vscode.ViewColumn.Active,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.file(__dirname)]
      }
    );

    let html = fs.readFileSync(path.join(__dirname, 'webview.html'), 'utf8');
    html = html.split('__START_DISGUISED__').join(cfg.get('startDisguised') ? 'true' : 'false');
    html = html.split('__AUTO_BLUR__').join(cfg.get('autoDisguiseOnBlur') ? 'true' : 'false');
    panel.webview.html = html;

    currentPanel = panel;
    panel.onDidDispose(() => { currentPanel = undefined; });
  });
  context.subscriptions.push(open);

  // 面板标题跟随设置变化
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('handDrill.panelTitle') && currentPanel) {
        currentPanel.title = panelTitle();
      }
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
