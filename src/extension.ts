// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// import [slash from 'slash';
const slash = require('slash');
```
Test Cases - 
linux and window paths
nested folders
correct values
```
// vsce publish
class Surge {
	surgeTypesData : {[id:string]:{file:string,name:string,lineno:number,args:string}};
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
  getLineData({file,line}:{file:string,line:number}) {
    const results = Object.values(this.surgeTypesData).filter(d => d.file === file && d.lineno === line);
    if (!results.length) {
      return null;
    }
    return results[0];
  }
	// getFunctionArgumentsHovertext(functionName: string) {
	// 	const validate = (name: string) =>{
	// 		return (name in this.surgeTypesData);
	// 	};
	// 	const transform = (name:string) => {
	// 		const data = this.surgeTypesData[name];
	// 		return JSON.stringify(data.args) + ' => ' + data.returnval;
	// 	};
	// 	if(!validate(functionName)) {
	// 		return '';
	// 	}
	// 	const output = transform(functionName);
	// 	return output;

	// }
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
			// const wordRange = document.getWordRangeAtPosition(position);
      // const word = document.getText(wordRange);
      // const typeText = surge.getFunctionArgumentsHovertext(word);
      const transformed_filename = slash(document.fileName)
      .split("/")
      .slice(-1)[0];
      const line_data = surge.getLineData({file:transformed_filename,line:position.line+1});
      if (!line_data) return new vscode.Hover("");
			return new vscode.Hover(`${line_data.args}`);
    }
	}));

}

// this method is called when your extension is deactivated
export function deactivate() {}
