// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

class Surge {
	surgeTypesData : {[id:string]:string};
	constructor() {
		this.surgeTypesData = {};

	}
	createTypesData(uri:vscode.Uri) {
		//TODO add error handing
		vscode.workspace.fs.readFile(uri)
		.then((val) => {
			const string = val.toString();
			this.surgeTypesData = JSON.parse(string);
		});
	}
	getFunctionArgumentsHovertext(functionName: string) {
		const validate = (name: string) =>{
			return (name in this.surgeTypesData);
		};
		const transform = (name:string) => {
			const data = this.surgeTypesData[name];
			return JSON.stringify(data);
		};
		if(!validate(functionName)) {
			return '';
		}
		const output = transform(functionName);
		return output;

	}
}
const surge = new Surge();
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "surge" is now active!');

	const fsWatcher = vscode.workspace.createFileSystemWatcher(
		'**/.surgetypes'
	);
	fsWatcher.onDidChange((uri) => {
		surge.createTypesData(uri);	
	});
	fsWatcher.onDidCreate((uri) => {
		surge.createTypesData(uri);	
	});

	context.subscriptions.push(fsWatcher);

	context.subscriptions.push(vscode.languages.registerHoverProvider('python', {
    provideHover(document, position, token) {
			const wordRange = document.getWordRangeAtPosition(position);
			const word = document.getText(wordRange);
			const typeText = surge.getFunctionArgumentsHovertext(word);
			return new vscode.Hover(typeText);
    }
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
