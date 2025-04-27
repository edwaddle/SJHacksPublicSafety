/**
 * Server restart helper script
 * This script helps identify and fix common issues with the server
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Check for the .env file
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

console.log('======================================');
console.log('Server restart helper');
console.log('======================================');

// Check for running processes on port 3001
console.log('\nChecking for processes on port 3001...');
const checkPortCommand = os.platform() === 'win32' 
  ? 'netstat -ano | findstr :3001' 
  : 'lsof -i :3001';

exec(checkPortCommand, (error, stdout, stderr) => {
  if (stdout && stdout.trim()) {
    console.log('Found processes running on port 3001:');
    console.log(stdout);
    
    if (os.platform() !== 'win32') {
      console.log('\nTo kill these processes, run:');
      const pidMatch = stdout.match(/\s+(\d+)\s+/);
      if (pidMatch && pidMatch[1]) {
        console.log(`kill -9 ${pidMatch[1]}`);
      } else {
        console.log('kill -9 PID  (replace PID with the process ID)');
      }
    } else {
      console.log('\nTo kill these processes, run:');
      const pidMatch = stdout.match(/\s+(\d+)$/);
      if (pidMatch && pidMatch[1]) {
        console.log(`taskkill /F /PID ${pidMatch[1]}`);
      } else {
        console.log('taskkill /F /PID PID  (replace PID with the process ID)');
      }
    }
    
    console.log('\nThen run this script again.\n');
  } else {
    console.log('No processes found on port 3001. Good!');
    
    // Create .env file if it doesn't exist
    if (!fs.existsSync(envPath)) {
      console.log('\n.env file not found. Creating one with default values...');
      
      const envContent = `PORT=3001
NASA_API_KEY=demo_key
OPENWEATHER_API_KEY=demo_key
OPENAI_API_KEY=demo_key
`;
      
      fs.writeFileSync(envPath, envContent);
      console.log('.env file created with demo values.');
    } else {
      console.log('\n.env file exists. Good!');
    }
    
    // Start the server
    console.log('\nStarting the server...');
    const serverProcess = exec('npm run dev', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error starting server: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`Server stderr: ${stderr}`);
      }
    });
    
    serverProcess.stdout.on('data', (data) => {
      console.log(data);
    });
    
    console.log('\nServer should be starting. Check for errors above.');
    console.log('If the server started successfully, try accessing the API again from your frontend.\n');
  }
});

console.log('\nFor more help, refer to the README.md file or check the API-DOCUMENTATION.md file.');
console.log('======================================\n'); 