const vscode = require('vscode');
const fs = require('fs')
const path = require('path')
const YamlHelperEditor = require('./yamlHelperEditor').YamlHelperEditor

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let config = vscode.workspace.getConfiguration("YamlHelper");
	let excel_path = config.get("excel_path");

	context.subscriptions.push(YamlHelperEditor.s_register(context, excel_path));
}
exports.activate = activate;
function deactivate() {}

module.exports = {
	activate,
	deactivate
}