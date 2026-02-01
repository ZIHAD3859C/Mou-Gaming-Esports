const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    gameMode: {
        type: String,
        enum: ['Solo', 'Duo', 'Squad'],
        required: true
    },
    entryFee: {
        type: Number,
        required: true
    },
    prizePool: {
        type: Number,
        required: true
    },
    maxTeams: {
        type: Number,
        required: true
    },
    registeredTeams: {
        type: Number,
        default: 0
    },
    startTime: {
        type: Date,
        required: true
    },
    registrationEndTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'live', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    rules: [{
        type: String
    }],
    prizeDistribution: [{
        position: Number,
        prize: Number,
        percentage: Number
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tournament', tournamentSchema);
