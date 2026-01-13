const { spawn } = require('child_process');
const port = process.env.PORT || 4200;

console.log(`Starting Angular on port ${port}...`);

spawn('ng', ['serve', '--port', port, '--host', '0.0.0.0'], { stdio: 'inherit', shell: true });
