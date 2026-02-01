// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const viewTournamentsBtn = document.getElementById('viewTournamentsBtn');
const tournamentsGrid = document.getElementById('tournamentsGrid');
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

// Sample Tournaments Data (Replace with API call)
const tournaments = [
    {
        id: 1,
        title: "Daily Solo Tournament",
        gameMode: "Solo",
        entryFee: 50,
        prizePool: 5000,
        maxTeams: 100,
        registeredTeams: 78,
        startTime: "2024-01-15T20:00:00",
        status: "upcoming"
    },
    {
        id: 2,
        title: "Weekend Squad Showdown",
        gameMode: "Squad",
        entryFee: 200,
        prizePool: 25000,
        maxTeams: 50,
        registeredTeams: 42,
        startTime: "2024-01-20T21:00:00",
        status: "upcoming"
    },
    {
        id: 3,
        title: "Free Entry Duo Tournament",
        gameMode: "Duo",
        entryFee: 0,
        prizePool: 2000,
        maxTeams: 80,
        registeredTeams: 65,
        startTime: "2024-01-16T19:00:00",
        status: "live"
    },
    {
        id: 4,
        title: "Pro Squad Championship",
        gameMode: "Squad",
        entryFee: 500,
        prizePool: 50000,
        maxTeams: 32,
        registeredTeams: 28,
        startTime: "2024-01-25T22:00:00",
        status: "upcoming"
    }
];

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadTournaments();
    setupEventListeners();
});

function setupEventListeners() {
    // Modal Controls
    loginBtn?.addEventListener('click', () => openModal(loginModal));
    registerBtn?.addEventListener('click', () => openModal(registerModal));
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => closeAllModals());
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // View Tournaments Button
    viewTournamentsBtn?.addEventListener('click', () => {
        document.querySelector('#tournaments').scrollIntoView({ behavior: 'smooth' });
    });

    // Hamburger Menu
    hamburger?.addEventListener('click', () => {
        navMenu?.classList.toggle('active');
    });

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterTournaments(btn.dataset.filter);
        });
    });

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Show Register from Login
    const showRegister = document.getElementById('showRegister');
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            openModal(registerModal);
        });
    }
}

// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Load Tournaments
function loadTournaments() {
    if (!tournamentsGrid) return;
    
    tournamentsGrid.innerHTML = '';
    
    tournaments.forEach(tournament => {
        const tournamentCard = createTournamentCard(tournament);
        tournamentsGrid.appendChild(tournamentCard);
    });
}

// Create Tournament Card
function createTournamentCard(tournament) {
    const card = document.createElement('div');
    card.className = 'tournament-card';
    
    const startDate = new Date(tournament.startTime);
    const formattedDate = startDate.toLocaleDateString('en-BD', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const progress = (tournament.registeredTeams / tournament.maxTeams) * 100;
    
    card.innerHTML = `
        <div class="tournament-header">
            <span class="tournament-badge badge-${tournament.status}">${tournament.status.toUpperCase()}</span>
            <h3>${tournament.title}</h3>
            <p>Mode: ${tournament.gameMode}</p>
        </div>
        <div class="tournament-body">
            <div class="tournament-info">
                <div class="info-item">
                    <i class="fas fa-coins"></i>
                    <p>Entry Fee</p>
                    <strong>৳${tournament.entryFee}</strong>
                </div>
                <div class="info-item">
                    <i class="fas fa-trophy"></i>
                    <p>Prize Pool</p>
                    <strong>৳${tournament.prizePool}</strong>
                </div>
                <div class="info-item">
                    <i class="fas fa-users"></i>
                    <p>Teams</p>
                    <strong>${tournament.registeredTeams}/${tournament.maxTeams}</strong>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${progress}%"></div>
            </div>
            <p><i class="far fa-calendar-alt"></i> Starts: ${formattedDate}</p>
        </div>
        <div class="tournament-footer">
            <button class="btn btn-primary btn-join" data-id="${tournament.id}">
                ${tournament.entryFee === 0 ? 'Join Free' : 'Register Now'}
            </button>
            <button class="btn btn-secondary btn-details">Details</button>
        </div>
    `;
    
    // Add event listeners to buttons
    const joinBtn = card.querySelector('.btn-join');
    const detailsBtn = card.querySelector('.btn-details');
    
    joinBtn.addEventListener('click', () => handleJoinTournament(tournament.id));
    detailsBtn.addEventListener('click', () => showTournamentDetails(tournament));
    
    return card;
}

// Filter Tournaments
function filterTournaments(filter) {
    let filteredTournaments = tournaments;
    
    if (filter === 'solo') {
        filteredTournaments = tournaments.filter(t => t.gameMode === 'Solo');
    } else if (filter === 'duo') {
        filteredTournaments = tournaments.filter(t => t.gameMode === 'Duo');
    } else if (filter === 'squad') {
        filteredTournaments = tournaments.filter(t => t.gameMode === 'Squad');
    } else if (filter === 'free') {
        filteredTournaments = tournaments.filter(t => t.entryFee === 0);
    } else if (filter === 'paid') {
        filteredTournaments = tournaments.filter(t => t.entryFee > 0);
    }
    
    tournamentsGrid.innerHTML = '';
    filteredTournaments.forEach(tournament => {
        tournamentsGrid.appendChild(createTournamentCard(tournament));
    });
}

// Handle Join Tournament
function handleJoinTournament(tournamentId) {
    // Check if user is logged in
    if (!localStorage.getItem('token')) {
        openModal(loginModal);
        return;
    }
    
    // TODO: Implement tournament joining logic
    console.log(`Joining tournament ${tournamentId}`);
    // Redirect to payment or confirmation page
}

// Show Tournament Details
function showTournamentDetails(tournament) {
    // TODO: Implement tournament details modal
    alert(`Tournament: ${tournament.title}\nPrize Pool: ৳${tournament.prizePool}\nMode: ${tournament.gameMode}`);
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        username: formData.get('username'),
        password: formData.get('password')
    };
    
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/users/login`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
        // const result = await response.json();
        
        // For demo purposes, simulate login
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ username: data.username }));
        
        closeAllModals();
        showNotification('Login successful!', 'success');
        updateAuthState();
        
    } catch (error) {
        showNotification('Login failed. Please try again.', 'error');
    }
}

// Handle Register
async function handleRegister(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    const userData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        phone: formData.get('phone'),
        freeFireId: formData.get('freeFireId')
    };
    
    try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${API_BASE_URL}/users/register`, {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        
        // For demo purposes, simulate registration
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        closeAllModals();
        showNotification('Registration successful!', 'success');
        updateAuthState();
        
    } catch (error) {
        showNotification('Registration failed. Please try again.', 'error');
    }
}

// Update Authentication State
function updateAuthState() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons && token) {
        authButtons.innerHTML = `
            <div class="user-menu">
                <span>Welcome, ${user.username}</span>
                <button class="btn btn-logout" id="logoutBtn">Logout</button>
            </div>
        `;
        
        document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    location.reload();
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 4px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .progress-bar {
        height: 6px;
        background-color: #eee;
        border-radius: 3px;
        margin: 1rem 0;
        overflow: hidden;
    }
    
    .progress {
        height: 100%;
        background-color: var(--success-color);
        transition: width 0.3s ease;
    }
`;
document.head.appendChild(style);

// Check auth state on page load
updateAuthState();
