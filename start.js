import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\n=======================================================');
console.log('Starting New Jodhpur Sweet Home Mandawa Application...');
console.log('=======================================================\n');

// 1. Start Backend Express Server
const backendPath = path.join(__dirname, 'backend');
console.log('[Orchestrator] Launching Node.js Express Backend (Port 5000)...');
const backendProcess = spawn(isWindows ? 'node' : 'node', ['src/server.js'], {
  cwd: backendPath,
  stdio: 'inherit'
});

// 2. Start Frontend Vite Dev Server
const frontendPath = path.join(__dirname, 'frontend');
console.log('[Orchestrator] Launching React Vite Frontend Server...');
const frontendProcess = spawn(npmCmd, ['run', 'dev'], {
  cwd: frontendPath,
  stdio: 'inherit'
});

// Reconcile exit codes
backendProcess.on('close', (code) => {
  console.log(`[Orchestrator] Backend process exited with code ${code}`);
  frontendProcess.kill();
  process.exit(code);
});

frontendProcess.on('close', (code) => {
  console.log(`[Orchestrator] Frontend process exited with code ${code}`);
  backendProcess.kill();
  process.exit(code);
});
