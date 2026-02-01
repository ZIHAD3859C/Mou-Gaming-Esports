const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');

// Get all tournaments
router.get('/', async (req, res) => {
    try {
        const { status, gameMode } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (gameMode) query.gameMode = gameMode;
        
        const tournaments = await Tournament.find(query)
            .sort({ startTime: 1 })
            .populate('organizer', 'username');
        
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single tournament
router.get('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id)
            .populate('organizer', 'username email');
        
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        
        res.json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create tournament (admin/organizer only)
router.post('/', async (req, res) => {
    try {
        const tournament = new Tournament(req.body);
        const savedTournament = await tournament.save();
        res.status(201).json(savedTournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update tournament
router.put('/:id', async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Register team for tournament
router.post('/:id/register', async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        
        if (tournament.registeredTeams >= tournament.maxTeams) {
            return res.status(400).json({ message: 'Tournament is full' });
        }
        
        if (new Date() > tournament.registrationEndTime) {
            return res.status(400).json({ message: 'Registration closed' });
        }
        
        tournament.registeredTeams += 1;
        await tournament.save();
        
        res.json({ message: 'Registration successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
