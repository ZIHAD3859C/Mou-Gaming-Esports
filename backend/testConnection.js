const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔗 Testing MongoDB Connection...');
console.log('Cluster: Cluster-Mou-Gaming-Esports');
console.log('Username: ZIHAD3859C\n');

const connectionString = process.env.MONGODB_URI || 'mongodb+srv://ZIHAD3859C:ZXppz3kFLTiacryb@cluster-mou-gaming-espo.e5hszis.mongodb.net/freefire_tournament?retryWrites=true&w=majority';

async function testConnection() {
    try {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        
        console.log('✅ SUCCESS! Connected to MongoDB');
        console.log(`Database: ${mongoose.connection.name}`);
        console.log(`Host: ${mongoose.connection.host}`);
        console.log(`Port: ${mongoose.connection.port}`);
        
        // List all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📁 Collections found:');
        collections.forEach(col => {
            console.log(`  - ${col.name}`);
        });
        
        if (collections.length === 0) {
            console.log('\n💡 No collections found. Run: npm run init-db');
        }
        
        mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ CONNECTION FAILED!');
        console.error('Error:', error.message);
        console.log('\n🔧 FIX THESE:');
        console.log('1. Go to MongoDB Atlas → Network Access → Add IP Address');
        console.log('2. Add: 0.0.0.0/0 (Allow from anywhere)');
        console.log('3. Wait 1-2 minutes');
        console.log('4. Try again');
        console.log('\n🔗 Your connection string:');
        console.log(connectionString);
    }
}

testConnection();
