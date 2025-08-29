#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Setting up Video Chat App for development...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env.local
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local from .env.example');
    
    // Generate a secure NEXTAUTH_SECRET
    const secret = crypto.randomBytes(32).toString('base64');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace('your-secret-key-here', secret);
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Generated secure NEXTAUTH_SECRET');
  } else {
    console.log('❌ .env.example file not found');
    process.exit(1);
  }
} else {
  console.log('✅ .env.local already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Set up MongoDB (local or Atlas)');
console.log('2. Configure Google OAuth credentials');
console.log('3. Update .env.local with your actual values');
console.log('4. Run: npm run dev');
console.log('\nSee SETUP.md for detailed instructions');

console.log('\n🔧 Current environment variables to configure:');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
lines.forEach(line => {
  if (line.includes('your-') || line.includes('mongodb://') || line.includes('localhost')) {
    console.log(`   ${line}`);
  }
});

console.log('\n✨ Setup complete! Happy coding!');