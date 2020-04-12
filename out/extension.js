const vscode = require('vscode');
const fs = require('fs')
const path = require('path')
const YamlHelperEditor = require('./yamlHelperEditor').YamlHelperEditor

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(YamlHelperEditor.s_register(context));
}
exports.activate = activate;
function deactivate() {}

module.exports = {
	activate,
	deactivate
}