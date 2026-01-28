import * as vscode from 'vscode';
import { reviewProject } from './index'; 

// Create output channel at the top level
const outputChannel = vscode.window.createOutputChannel('Revio');

export function activate(context: vscode.ExtensionContext) {
    console.log('Revio is now active!');

    const disposable = vscode.commands.registerCommand('extension.reviewCode', async () => {
        try {
            // DON'T show output channel yet - let user make selections first
            const provider = await vscode.window.showQuickPick(['ollama', 'gemini'], { 
                placeHolder: 'Choose AI provider' 
            });
            if (!provider) {
                return; // User cancelled, don't show output
            }

            let apiKey: string | undefined;
            if (provider === 'gemini') {
                // 1. Try to get the key from secure storage
                apiKey = await context.secrets.get('gemini_api_key');

                // 2. If no key is found, ask the user for it
                if (!apiKey) {
                    apiKey = await vscode.window.showInputBox({ 
                        prompt: 'Enter Gemini API Key (This will be saved securely)', 
                        password: true 
                    });

                    if (apiKey) {
                        // 3. Store the key for next time
                        await context.secrets.store('gemini_api_key', apiKey);
                    }
                }

                if (!apiKey) {
                    return; // User cancelled, don't show output
                }
            }

            const folderUri = await vscode.window.showOpenDialog({ canSelectFolders: true });
            if (!folderUri) {
                return; // User cancelled, don't show output
            }

            // NOW show the output channel after all selections are made
            outputChannel.clear();
            outputChannel.show();
            outputChannel.appendLine('🚀 Revio Code Review Started');
            outputChannel.appendLine('═'.repeat(50));
            outputChannel.appendLine(`✓ Provider selected: ${provider}`);
            
            if (provider === 'gemini') {
                outputChannel.appendLine('✓ Using Gemini API key');
            }
            
            outputChannel.appendLine(`📁 Target folder: ${folderUri[0].fsPath}`);
            outputChannel.appendLine('═'.repeat(50));

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: "Revio: Reviewing...",
                cancellable: false
            }, async () => {
                await reviewProject({ 
                    folderPath: folderUri[0].fsPath, 
                    provider, 
                    apiKey,
                    outputChannel  // Pass output channel to reviewProject
                });
            });

            outputChannel.appendLine('═'.repeat(50));
            outputChannel.appendLine('✅ Review Complete!');
            vscode.window.showInformationMessage('✅ Review Complete! Check the Revio output panel for details.');
        } catch (err: any) {
            outputChannel.show();
            outputChannel.appendLine('═'.repeat(50));
            outputChannel.appendLine(`❌ Error: ${err.message}`);
            outputChannel.appendLine(`Stack trace: ${err.stack}`);
            vscode.window.showErrorMessage(`Revio Error: ${err.message}`);
        }
    });

    // Added a command to let users clear the key if they want to change it
    const resetDisposable = vscode.commands.registerCommand('extension.resetApiKey', async () => {
        await context.secrets.delete('gemini_api_key');
        outputChannel.show();
        outputChannel.appendLine('🔑 API Key has been removed from secure storage');
        vscode.window.showInformationMessage('Revio: API Key has been removed.');
    });

    // Add output channel to subscriptions so it gets disposed properly
    context.subscriptions.push(disposable, resetDisposable, outputChannel);
}

export function deactivate() {}