import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');

console.log('Starting Vite from:', vitePath);

const child = spawn('node', [vitePath, '--host', '--port', '5173'], {
    cwd: __dirname,
    shell: false,
    stdio: 'inherit'
});

child.on('error', (err) => {
    console.error('Failed to start Vite:', err);
});
