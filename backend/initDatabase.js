const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Tournament = require('./models/Tournament');
const Team = require('./models/Team');

async function initDatabase() {
    console.log('🎮 Initializing Free Fire Tournament Database...');
    
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB Atlas');
        
        // Clear existing data (optional - remove this line if you don't want to clear)
        // await User.deleteMany({});
        // await Tournament.deleteMany({});
        // await Team.deleteMany({});
        
        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        
        const adminUser = new User({
            username: 'admin',
            email: 'admin@freefirebd.com',
            password: hashedPassword,
            phone: '+8801712345678',
            freeFireId: 'ADMIN001',
            level: 100,
            role: 'admin',
            tournamentsPlayed: 0,
            tournamentsWon: 0,
            totalEarnings: 0
        });
        
        await adminUser.save();
        console.log('👑 Admin user created: admin / admin123');
        
        // Create Sample Tournaments
        const sampleTournaments = [
            {
                title: "Daily Solo Challenge",
                description: "Join our daily solo tournament and win cash prizes! Perfect for solo players in Bangladesh.",
                gameMode: "Solo",
                entryFee: 50,
                prizePool: 5000,
                maxTeams: 100,
                registeredTeams: 45,
                startTime: new Date(Date.now() + 86400000), // Tomorrow
                registrationEndTime: new Date(Date.now() + 43200000), // 12 hours from now
                status: "upcoming",
                rules: [
                    "No cheating or hacking",
                    "No teaming in solo matches",
                    "Respect all players",
                    "Screen recording required",
                    "Must have Bangladesh server"
                ],
                prizeDistribution: [
                    { position: 1, prize: 2500, percentage: 50 },
                    { position: 2, prize: 1500, percentage: 30 },
                    { position: 3, prize: 1000, percentage: 20 }
                ],
                organizer: adminUser._id
            },
            {
                title: "Weekend Squad Championship",
                description: "Weekly squad tournament with massive prize pool! Bring your team and compete.",
                gameMode: "Squad",
                entryFee: 200,
                prizePool: 25000,
                maxTeams: 50,
                registeredTeams: 32,
                startTime: new Date(Date.now() + 172800000), // 2 days
                registrationEndTime: new Date(Date.now() + 129600000), // 1.5 days
                status: "upcoming",
                rules: [
                    "4 players per team",
                    "Team name must match registration",
                    "Captain must verify all players",
                    "Payment through bKash/Nagad",
                    "Match will be on Bermuda map"
                ],
                prizeDistribution: [
                    { position: 1, prize: 15000, percentage: 60 },
                    { position: 2, prize: 7500, percentage: 30 },
                    { position: 3, prize: 2500, percentage: 10 }
                ],
                organizer: adminUser._id
            },
            {
                title: "Free Entry Duo Tournament",
                description: "Practice tournament with free entry! Perfect for new players.",
                gameMode: "Duo",
                entryFee: 0,
                prizePool: 2000,
                maxTeams: 80,
                registeredTeams: 68,
                startTime: new Date(Date.now() + 21600000), // 6 hours
                registrationEndTime: new Date(Date.now() + 10800000), // 3 hours
                status: "live",
                rules: [
                    "Free entry for all",
                    "Perfect for beginners",
                    "Learn tournament rules",
                    "No toxic behavior",
                    "Have fun!"
                ],
                prizeDistribution: [
                    { position: 1, prize: 1000, percentage: 50 },
                    { position: 2, prize: 600, percentage: 30 },
                    { position: 3, prize: 400, percentage: 20 }
                ],
                organizer: adminUser._id
            }
        ];
        
        for (const tournamentData of sampleTournaments) {
            const tournament = new Tournament(tournamentData);
            await tournament.save();
            console.log(`🏆 Tournament created: ${tournament.title}`);
        }
        
        // Create Sample Team
        const sampleTeam = new Team({
            teamName: "Bangladesh Warriors",
            tag: "BDW",
            captain: adminUser._id,
            players: [
                {
                    user: adminUser._id,
                    freeFireId: "ADMIN001",
                    inGameName: "BD_Admin"
                }
            ],
            totalEarnings: 0
        });
        
        await sampleTeam.save();
        console.log(`👥 Team created: ${sampleTeam.teamName}`);
        
        console.log('\n🎉 Database initialization complete!');
        console.log('\n📊 Summary:');
        console.log(`- 👑 1 Admin user created`);
        console.log(`- 🏆 ${sampleTournaments.length} Tournaments created`);
        console.log(`- 👥 1 Team created`);
        console.log('\n🔗 MongoDB Cluster: Cluster-Mou-Gaming-Esports');
        console.log('👤 Connected as: ZIHAD3859C');
        
        mongoose.connection.close();
        
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        process.exit(1);
    }
}

initDatabase();
