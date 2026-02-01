const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: {
        type: String,
        required: true,
        unique: true
    },
    tag: {
        type: String,
        maxlength: 4
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    players: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        freeFireId: String,
        inGameName: String
    }],
    tournaments: [{
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament'
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        position: Number,
        kills: Number,
        prizeWon: Number
    }],
    totalEarnings: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team', teamSchema);
