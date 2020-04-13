const vscode = require('vscode');
const path = require('path')
const yaml = require('js-yaml')

class YamlHelperEditor {
    static s_register(context) {
        let provider = new YamlHelperEditor(context);
        let provider_dispose = vscode.window.registerCustomEditorProvider("yaml_helper_editor", provider)
        return provider_dispose;
    }

    /**
     * @param  {vscode.ExtensionContext} context
     */
    constructor(context) {
        this.context = context;
    }

    /**
     * @param  {vscode.TextDocument} document
     * @param  {vscode.WebviewPanel} webviewPanel
     * @param  {vscode.CancellationToken} _token
     */
    async resolveCustomTextEditor(document, webviewPanel, _token) {
        webviewPanel.webview.options = {
            enableScripts: true,
        };
        webviewPanel.webview.html = getTextHtml(this.context, webviewPanel.webview);

        function updateWebView() {
            let text = document.getText();
            try {
                let yaml_obj = yaml.load(text);
                console.log(yaml_obj);
                webviewPanel.webview.postMessage({
                    command: "update",
                    yaml_content: yaml_obj
                });
            } catch (error) {
                vscode.window.showErrorMessage(error.toString());
            }
            // console.log(yaml.dump(yaml_obj, {
            //     indent: 4
            // }));
        }

        const changeTextDocument = vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.document.uri.toString() == document.uri.toString()) {
                updateWebView();
            }
        });

        webviewPanel.onDidDispose(() => {
            changeTextDocument.dispose();
        });

        webviewPanel.webview.onDidReceiveMessage((e) => {
            switch (e.command) {
                case "delete":
                    console.log("delete");
                    break;
                case "open_file":
                    break;
                default:
                    console.log("no demand");
            }
        });

        updateWebView();
    }
}
module.exports = {
    YamlHelperEditor
}

/**
 * @param  {vscode.Webview} webview
 */
function getTextHtml(context, webview) {
    let style_path = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "yaml_file_editor", "yamlHelper.css")));
    let js_path = webview.asWebviewUri(vscode.Uri.file(path.join(context.extensionPath, "yaml_file_editor", "yamlHelper.js")));

    return `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>test</title>
        <link href="${style_path}" rel="stylesheet" />
    </head>
    <body>
        <div id="item">
            <input type="text" placeholder="test">
            <button class="add_button" id="BottomButton">增加</button>
        </div>
        <script src="${js_path}"></script>
    </body>
    </html>
        `
}