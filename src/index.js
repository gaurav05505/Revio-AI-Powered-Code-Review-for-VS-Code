import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

// PROVIDERS 
import * as ollamaProvider from './Providers/Ollama.js';
import * as geminiProvider from './Providers/Gemini.js';

// Configuration 
const OLLAMA_MODEL = 'codellama:7b';
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

// File extensions to accept or reject
const Aext = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css'];
const Rext = ['node_modules', 'dist', 'build', '.git', '.vscode', 'out'];

//  FILE OPERATIONS 

function listFile(directory) {
    const result = [];
    function scan(dir) {
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            
            // Check if the current item is in the restricted list
            if (Rext.some(exclude => item === exclude)) {
                continue;
            }

            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                scan(fullPath); // Recursive call
            } else if (stat.isFile()) {
                if (Aext.includes(path.extname(item))) {
                    result.push(fullPath);
                }
            }
        }
    }
    scan(directory);
    return result;
}

function readFile(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf-8');
}

//  MAIN AGENT

export async function reviewProject({ folderPath, provider: providerType, apiKey, outputChannel }) {
    
    const targetDir = folderPath;
    
    if (!fs.existsSync(targetDir)) {
        throw new Error(`Path does not exist: ${targetDir}`);
    }

    // Helper function to log to both console and output channel
    const log = (message, colorFn = chalk.white) => {
        console.log(colorFn(message));
        if (outputChannel) {
            // Remove chalk colors for VS Code output
            const cleanMessage = message.replace(/\x1B\[[0-9;]*m/g, '');
            outputChannel.appendLine(cleanMessage);
        }
    };

    // 1. Setup Provider
    let selectedProvider;
    let selectedModel;

    if (providerType === 'gemini') {
        selectedProvider = geminiProvider;
        selectedModel = GEMINI_MODEL;
        log(`🤖 Initializing Gemini (${GEMINI_MODEL})...`, chalk.blue);
        if (typeof geminiProvider.initialize === 'function') {
            geminiProvider.initialize(apiKey);
        }
    } else {
        selectedProvider = ollamaProvider;
        selectedModel = OLLAMA_MODEL;
        log(`🤖 Initializing Ollama (${OLLAMA_MODEL})...`, chalk.blue);
        // Verify Ollama is awake
        if (typeof ollamaProvider.initialize === 'function') {
            await ollamaProvider.initialize();
        }
    }

    log(`🔍 Reviewing project: ${targetDir}`, chalk.blue.bold);
    log(`🤖 AI Provider: ${providerType}`, chalk.blue);

    // 2. Get Files
    log('📂 Scanning project files...', chalk.cyan);
    const files = listFile(targetDir);
    log(`🗃️  Found ${files.length} files to analyze.`, chalk.magenta);
    
    if (outputChannel) {
        outputChannel.appendLine('');
        outputChannel.appendLine('Files to review:');
        files.forEach((file, index) => {
            outputChannel.appendLine(`  ${index + 1}. ${path.basename(file)}`);
        });
        outputChannel.appendLine('');
    }

    let fixedFileCount = 0;
    let noChangeCount = 0;
    let errorCount = 0;

    // 3. Process Files
    log('─'.repeat(50), chalk.gray);
    log('🔄 Starting code review...', chalk.cyan.bold);
    log('─'.repeat(50), chalk.gray);

    for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        const fileName = path.basename(filePath);
        
        // Progress indicator
        log(`\n[${i + 1}/${files.length}] ⏳ Analyzing: ${fileName}...`, chalk.yellow);

        try {
            const originalCode = readFile(filePath);
            
            // Call AI to fix code
            log(`   🤔 Asking to review...`, chalk.gray);
            const fixedCode = await selectedProvider.fixCode(filePath, originalCode, selectedModel);

            // Handle "No Changes" scenarios
            if (!fixedCode || fixedCode.trim() === 'NO_CHANGES' || fixedCode.trim() === originalCode.trim()) {
                log(`   ✔ No changes needed for ${fileName}`, chalk.gray);
                noChangeCount++;
                continue;
            }

            // Get Summary
            if (selectedProvider.getDiffSummary) {
                try {
                    const diffSummary = await selectedProvider.getDiffSummary(originalCode, fixedCode, filePath, selectedModel);
                    log(`   📝 Summary: ${diffSummary.replace(/\n/g, ' ')}`, chalk.white);
                } catch (sErr) {
                    
                }
            }

            // Apply Fix
            writeFile(filePath, fixedCode);
            fixedFileCount++;
            log(`   ✅ Fixed: ${fileName}`, chalk.green);

        } catch (err) {
            errorCount++;
            log(`   ❌ Error in ${fileName}: ${err.message}`, chalk.red);
            if (outputChannel) {
                outputChannel.appendLine(`   Stack: ${err.stack}`);
            }
        }
    }

    // Final Report
    log('\n' + '═'.repeat(50), chalk.gray);
    log('📊 REVIEW COMPLETE', chalk.green.bold);
    log('═'.repeat(50), chalk.gray);
    log(`✅ Fixed: ${fixedFileCount} files`, chalk.green);
    log(`✔️  No changes: ${noChangeCount} files`, chalk.gray);
    if (errorCount > 0) {
        log(`❌ Errors: ${errorCount} files`, chalk.red);
    }
    log(`📁 Total analyzed: ${files.length} files`, chalk.blue);
    log('═'.repeat(50), chalk.gray);

    return { total: files.length, fixed: fixedFileCount, noChanges: noChangeCount, errors: errorCount };
}