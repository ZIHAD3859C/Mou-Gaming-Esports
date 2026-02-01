const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5000', 'https://freefire-tournament-bd.vercel.app'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection - YOUR SPECIFIC CLUSTER
const MONGODB_URI = process.env.MONGODB_URI || 
    'mongodb+srv://ZIHAD3859C:ZXppz3kFLTiacryb@cluster-mou-gaming-espo.e5hszis.mongodb.net/freefire_tournament?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log('🎮 ========================================');
    console.log('🎮 FREE FIRE TOURNAMENT BANGLADESH');
    console.log('🎮 ========================================');
    console.log('✅ MongoDB Atlas Connected Successfully!');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Cluster: Cluster-Mou-Gaming-Esports`);
    console.log(`👤 User: ZIHAD3859C`);
    console.log('🎮 ========================================\n');
})
.catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('\n💡 SOLUTIONS:');
    console.log('1. Whitelist your IP in MongoDB Atlas:');
    console.log('   - Go to https://cloud.mongodb.com');
    console.log('   - Click "Network Access"');
    console.log('   - Add IP Address: 0.0.0.0/0');
    console.log('2. Check your password');
    console.log('3. Ensure cluster is not paused\n');
});

// Import routes
const tournamentRoutes = require('./routes/tournaments');
const teamRoutes = require('./routes/teams');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');

// Use routes
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Welcome route
app.get('/api', (req, res) => {
    res.json({
        message: '🎮 Welcome to Free Fire Tournament Bangladesh API!',
        version: '1.0.0',
        endpoints: {
            tournaments: '/api/tournaments',
            users: '/api/users',
            teams: '/api/teams',
            payments: '/api/payments'
        },
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'Free Fire Tournament API',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        uptime: process.uptime()
    });
});

// Serve frontend in production
app.use(express.static(path.join(__dirname, '../frontend')));

// For all other routes, serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Local: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log('\n🎮 Free Fire Tournament Platform Ready!');
    console.log('🇧🇩 Made for Bangladeshi Players 🇧🇩\n');
});
