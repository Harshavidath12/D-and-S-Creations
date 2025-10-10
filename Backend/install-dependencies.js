// Installation script for Cinema Management API
// Run with: node install-dependencies.js

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Installing Cinema Management API Dependencies...');
console.log('=' .repeat(50));

try {
    // Install dependencies
    console.log('\n📦 Installing dependencies...');
    execSync('npm install express mongoose cors morgan dotenv express-validator', { stdio: 'inherit' });
    
    // Install dev dependencies
    console.log('\n🔧 Installing dev dependencies...');
    execSync('npm install --save-dev nodemon jest supertest eslint', { stdio: 'inherit' });
    
    // Create .env file if it doesn't exist
    if (!fs.existsSync('.env')) {
        console.log('\n📝 Creating .env file...');
        const envContent = `# Environment Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://vihigum:H4UiHdZM640pbRnI@cluster0.sp3lpkf.mongodb.net/test?retryWrites=true&w=majority&tls=true

# API Configuration
API_VERSION=1.0.0
API_NAME=Cinema Management API

# Logging
LOG_LEVEL=info

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
`;
        fs.writeFileSync('.env', envContent);
        console.log('✅ .env file created');
    }
    
    console.log('\n✅ Installation completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Test the API: node test-crud-operations.js');
    console.log('   3. Visit: http://localhost:5000');
    console.log('   4. API docs: http://localhost:5000/api');
    
} catch (error) {
    console.error('❌ Installation failed:', error.message);
    console.log('\n💡 Try running: npm install');
}
