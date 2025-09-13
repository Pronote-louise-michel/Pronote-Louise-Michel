// Variables globales
let currentUser = null;
let currentPage = 'home';
let currentWeek = 0;
let currentDay = 0; // 0 = Lundi, 1 = Mardi, etc.
let currentWeekVieScolaire = 0;
let isMobileMenuOpen = false;

// Données simulées
const scheduleData = {
    weeks: [],
    courses: {}
};

// Emploi du temps fixe pour chaque jour de la semaine
const fixedWeeklySchedule = {
    0: [ // Lundi
        { time: '08h00', subject: 'MSGENU', teacher: 'GHADAS S.', room: '211i', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '09h00', subject: 'DROIT ET ECONOMIE', teacher: 'GHDAS S.', room: '223', color: 'bg-pink-200', textColor: 'text-pink-800' },
        { time: '10h10', subject: 'DROIT ET ECONOMIE', teacher: 'GHDAS S.', room: '223', color: 'bg-pink-200', textColor: 'text-pink-800' },
        { time: '11h10', subject: 'ESPAGNOL LV2', teacher: 'CANOVAS PEREZ A.', room: '207i', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '13h10', subject: 'HISTOIRE-GEOGRAPHIE', teacher: 'M. MOINOUFAMA T. H.', room: '117', color: 'bg-yellow-200', textColor: 'text-yellow-800' },
        { time: '14h10', subject: 'MATHEMATIQUES', teacher: 'M. DEGBEGNON K.', room: '106', color: 'bg-teal-200', textColor: 'text-teal-800' },
        { time: '16h15', subject: 'ACCOMPAGNEMT. PERSO.', teacher: 'M. GHDAS S.', room: '202i', color: 'bg-gray-200', textColor: 'text-gray-800' },
    ],
    1: [ // Mardi
        { time: '08h00', subject: 'ED.PHYSIQUE & SPORT.', teacher: 'M. MARION H.', room: 'Gymnase', color: 'bg-blue-200', textColor: 'text-blue-800' },
        { time: '09h00', subject: 'ED.PHYSIQUE & SPORT.', teacher: 'M. MARION H.', room: 'Gymnase', color: 'bg-blue-200', textColor: 'text-blue-800' },
        { time: '10h10', subject: 'MSGN/RH-COMMUNICAT.', teacher: 'GHDAS S.', room: '223', color: 'bg-pink-200', textColor: 'text-pink-800' },
        { time: '11h10', subject: 'MSGN/RH-COMMUNICAT.', teacher: 'GHDAS S.', room: '223', color: 'bg-pink-200', textColor: 'text-pink-800' },
        { time: '12h10', subject: 'PHILOSOPHIE', teacher: 'Mme LARIBLE C.', room: '206', color: 'bg-green-200', textColor: 'text-green-800' },
        { time: '15h15', subject: 'ESPAGNOL LV2', teacher: 'M. CANOVAS PEREZ A.', room: 'Gymnase', color: 'bg-blue-200', textColor: 'text-blue-800' },
    ],
    2: [ // Mercredi
        { time: '08h00', subject: 'DROIT ET ECONOMIE', teacher: 'M. NOEL K.', room: '223', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '09h00', subject: 'DROIT ET ECONOMIE', teacher: 'M. NOEL K.', room: '223', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '10h10', subject: 'ANGLAIS LV1', teacher: 'Mme MATHIAS I.', room: '214', color: 'bg-blue-200', textColor: 'text-blue-800' },
        { time: '12h10', subject: 'MSGENU', teacher: 'M. EUDELINE-JEUNET J.', room: '221', color: 'bg-gray-200', textColor: 'text-gray-800' },
    ],
    3: [ // Jeudi
        { time: '08h00', subject: 'MSGN/RH-COMMUNICAT.', teacher: 'M. GHDAS S.', room: '210', color: 'bg-yellow-200', textColor: 'text-yellow-800' },
        { time: '09h00', subject: 'MSGN/RH-COMMUNICAT.', teacher: 'M. GHDAS S.', room: '210', color: 'bg-yellow-200', textColor: 'text-yellow-800' },
        { time: '10h10', subject: 'MSGENU', teacher: 'GHADAS S.', room: '210', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '11h10', subject: 'MSGENU', teacher: 'GHADAS S.', room: '210', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '13h10', subject: 'PHILOSOPHIE', teacher: 'Mme LARIBLE C.', room: '109i', color: 'bg-green-200', textColor: 'text-green-800' },
        { time: '14h10', subject: 'DROIT ET ECONOMIE', teacher: 'M. NOEL K.', room: '221i', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '15h15', subject: 'DROIT ET ECONOMIE', teacher: 'M. NOEL K.', room: '221i', color: 'bg-red-200', textColor: 'text-red-800' },
        { time: '16h15', subject: 'ETLV', teacher: 'Mme MATHIAS I.', room: '211i', color: 'bg-green-200', textColor: 'text-green-800' },
    ],
    4: [ // Vendredi
        { time: '08h00', subject: 'ACCOMPAGNEMT. PERSO.', teacher: 'M. EUDELINE-JEUNET J.', room: '109i', color: 'bg-gray-200', textColor: 'text-gray-800' },
        { time: '09h00', subject: 'MSGENU', teacher: 'M. EUDELINE-JEUNET J.', room: '221', color: 'bg-gray-200', textColor: 'text-gray-800' },
        { time: '10h10', subject: 'MSGENU', teacher: 'M. EUDELINE-JEUNET J.', room: '221', color: 'bg-gray-200', textColor: 'text-gray-800' },
        { time: '11h10', subject: 'ANGLAIS LV1', teacher: 'ESTRADA F.', room: '123', color: 'bg-blue-200', textColor: 'text-blue-800' },
        { time: '14h10', subject: 'MATHEMATIQUES', teacher: 'M. DEGBEGNON K.', room: '106', color: 'bg-teal-200', textColor: 'text-teal-800' },
        { time: '14h10', subject: 'ANGLAIS LV1', teacher: 'ESTRADA F.', room: '123', color: 'bg-blue-200', textColor: 'text-blue-800' },
        { time: '15h15', subject: 'MANAGEMENT', teacher: 'KOUROUMA A.', room: '122', color: 'bg-green-200', textColor: 'text-green-800' },
        { time: '16h15', subject: 'SC.GESTION&NUMERIQUE', teacher: 'NOEL K.', room: '109i', color: 'bg-gray-200', textColor: 'text-gray-800' },
        { time: '17h15', subject: 'ETUDE', teacher: 'Surveillant', room: 'CDI', color: 'bg-green-200', textColor: 'text-green-800' },
        { time: '18h15', subject: 'ETUDE', teacher: 'Surveillant', room: 'CDI', color: 'bg-green-200', textColor: 'text-green-800' }
    ]
};

// Initialisation
document.addEventListener('DOMContentLoaded', async function() {
    generateScheduleData();
    await initSchedulePersistence();
    await initializeApp();
    await checkAuthStatus();
});

async function initializeApp() {
    // Gestionnaires d'événements pour la connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Gestionnaires d'événements pour la navigation
    setupNavigation();
    
    // Gestionnaires d'événements pour les données utilisateur
    setupDataPageEvents();
    
    // Gestionnaires d'événements pour le formulaire de mot de passe
    setupPasswordForm();

    // Gestionnaires pour les notes
    setupNotesEvents();

    // Gestionnaires pour le cahier de textes
    setupCahierTextesEvents();

    // Initialiser les données admin
    await loadAdminData();
}

async function checkAuthStatus() {
    const savedUser = localStorage.getItem('pronote_user');
    const savedAuth = localStorage.getItem('pronote_authenticated');
    const savedPage = localStorage.getItem('pronote_current_page');
    
    if (savedUser && savedAuth === 'true') {
        try {
            currentUser = JSON.parse(savedUser);
            
            // Vérifier s'il s'agit d'un compte admin
            if (currentUser.username === 'admin' || currentUser.role === 'admin') {
                await showAdminPanel();
            } else {
                await showMainApp();
                if (savedPage) {
                    await goToPage(savedPage);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la restauration de la session:', error);
            clearAuthData();
            showLoginPage();
        }
    } else {
        showLoginPage();
    }
}

function showLoginPage() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'none';
}

async function showMainApp() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    document.getElementById('adminPanel').style.display = 'none';
    
    // Charger le contenu de la page d'accueil
    await loadHomePage();
}

async function showAdminPanel() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    
    // Charger les données admin
    await renderAdminData();
}

function clearAuthData() {
    localStorage.removeItem('pronote_user');
    localStorage.removeItem('pronote_authenticated');
    localStorage.removeItem('pronote_current_page');
}

// Gestion de la connexion
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleIcon.className = 'fas fa-eye';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginSpinner = document.getElementById('loginSpinner');
    const errorDiv = document.getElementById('loginError');
    const errorText = document.getElementById('errorText');
    
    // Validation
    if (!username) {
        showLoginError('Veuillez saisir votre identifiant');
        return;
    }
    
    if (!password) {
        showLoginError('Veuillez saisir votre mot de passe');
        return;
    }
    
    // Afficher le spinner
    loginBtn.disabled = true;
    loginBtnText.style.display = 'none';
    loginSpinner.style.display = 'inline-block';
    errorDiv.style.display = 'none';
    
    try {
        // Utiliser l'API pour la connexion
        const result = await apiClient.login(username, password);
        
        if (result.success) {
            // Connexion réussie
            currentUser = { 
                username, 
                password,
                role: username === 'admin' ? 'admin' : 'student'
            };
            localStorage.setItem('pronote_user', JSON.stringify(currentUser));
            localStorage.setItem('pronote_authenticated', 'true');
            
            if (currentUser.role === 'admin') {
                await showAdminPanel();
            } else {
                localStorage.setItem('pronote_current_page', 'home');
                await showMainApp();
            }
        } else {
            // Échec de la connexion
            showLoginError('Identifiant ou mot de passe incorrect');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showLoginError('Erreur de connexion au serveur');
    } finally {
        // Masquer le spinner
        loginBtn.disabled = false;
        loginBtnText.style.display = 'inline';
        loginSpinner.style.display = 'none';
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

function logout() {
    currentUser = null;
    currentPage = 'home';
    clearAuthData();
    showLoginPage();
    
    // Réinitialiser le formulaire de connexion
    document.getElementById('loginForm').reset();
    document.getElementById('loginError').style.display = 'none';
}

// Navigation
function setupNavigation() {
    // Navigation desktop
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            goToPage(page);
        });
    });
    
    // Navigation mobile
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            goToPage(page);
        });
    });
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    
    isMobileMenuOpen = !isMobileMenuOpen;
    
    if (isMobileMenuOpen) {
        mobileMenu.style.display = 'block';
        mobileMenuIcon.className = 'fas fa-times';
    } else {
        mobileMenu.style.display = 'none';
        mobileMenuIcon.className = 'fas fa-bars';
    }
}

async function goToPage(page) {
    // Masquer toutes les pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    // Convert hyphenated page names to camelCase for element ID lookup
    const pageId = hyphenToCamelCase(page) + 'Page';
    
    // Afficher la page demandée
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Mettre à jour la navigation
    updateNavigation(page);
    
    // Sauvegarder la page actuelle
    currentPage = page;
    if (currentUser) {
        localStorage.setItem('pronote_current_page', page);
    }
    
    // Fermer le menu mobile
    if (isMobileMenuOpen) {
        toggleMobileMenu();
    }
    
    // Charger le contenu spécifique de la page
    if (page === 'home') {
        await loadHomePage();
    } else if (page === 'notes') {
        await loadNotesPage();
    } else if (page === 'vie-scolaire') {
        await loadVieScolairePage();
    } else if (page === 'cahier-textes') {
        await loadCahierTextesPage();
    }
}

function hyphenToCamelCase(str) {
    return str.replace(/-([a-z])/g, function(match, letter) {
        return letter.toUpperCase();
    });
}

function updateNavigation(activePage) {
    // Navigation desktop
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === activePage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Navigation mobile
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        const page = item.getAttribute('data-page');
        if (page === activePage) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Mettre à jour le titre de la page mobile
    const currentPageTitle = document.getElementById('currentPageTitle');
    const pageLabels = {
        'home': 'Page d\'accueil',
        'mes-donnees': 'Mes données',
        'cahier-textes': 'Cahier de textes',
        'notes': 'Notes',
        'vie-scolaire': 'Vie scolaire'
    };
    
    if (currentPageTitle && pageLabels[activePage]) {
        currentPageTitle.textContent = pageLabels[activePage];
    }
}

// Génération des données d'emploi du temps
function generateScheduleData() {
    const startDate = new Date(2024, 8, 2); // 2 septembre 2024
    const weekTypes = ['P', 'A', 'B'];
    const timeSlots = ['08h00', '09h00', '10h10', '11h10', '12h10', '13h10', '14h10', '15h15', '16h15', '17h15', '18h15'];
    
    // Générer 44 semaines
    for (let i = 0; i < 44; i++) {
        const weekStart = new Date(startDate);
        weekStart.setDate(startDate.getDate() + (i * 7));
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 4);
        
        const formatDate = (date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
            return `${day}/${months[date.getMonth()]}`;
        };
        
        // Générer les jours de la semaine avec dates
        const days = [];
        const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
        for (let j = 0; j < 5; j++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(weekStart.getDate() + j);
            days.push({
                name: dayNames[j],
                date: formatDate(currentDay),
                fullDate: currentDay
            });
        }
        
        scheduleData.weeks.push({
            label: `du ${formatDate(weekStart)} au ${formatDate(weekEnd)} - Semaine ${weekTypes[i % 3]}`,
            timeSlots: timeSlots,
            days: days
        });
        
        // Utiliser l'emploi du temps fixe pour chaque semaine
        scheduleData.courses[i] = {};
        
        // Copier l'emploi du temps fixe pour chaque jour de la semaine
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            scheduleData.courses[i][dayIndex] = [...fixedWeeklySchedule[dayIndex]];
        }
    }
}
async function initSchedulePersistence() {
    try {
        // Vérifier si on a déjà des données sauvegardées
        const saved = await loadData('scheduleData');
        if (saved && saved.courses && saved.weeks && saved.weeks.length > 0) {
            scheduleData.weeks = saved.weeks;
            scheduleData.courses = saved.courses;
            console.log('Emploi du temps chargé depuis l\'API');
        } else {
            // Sinon, on sauvegarde la version générée
            await saveScheduleToAPI(scheduleData);
            console.log('Emploi du temps initialisé et sauvegardé');
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'emploi du temps:', error);
        // En cas d'erreur, sauvegarder quand même les données générées
        try {
            await saveScheduleToAPI(scheduleData);
        } catch (saveError) {
            console.error('Erreur lors de la sauvegarde:', saveError);
        }
    }
}

// Chargement de la page d'accueil
async function loadHomePage() {
    await loadSchedule();
    await loadHomework();
    loadResources();
    loadInfo();
}

async function loadSchedule() {
    const scheduleContent = document.getElementById('scheduleContent');
    const currentWeekLabel = document.getElementById('currentWeekLabel');
    
    if (!scheduleContent || !currentWeekLabel) return;
    
    try {
        // Charger les données depuis l'API
        const scheduleDataFromAPI = await loadData('scheduleData');
        if (scheduleDataFromAPI && scheduleDataFromAPI.weeks && scheduleDataFromAPI.courses) {
            scheduleData.weeks = scheduleDataFromAPI.weeks;
            scheduleData.courses = scheduleDataFromAPI.courses;
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'emploi du temps:', error);
    }
    
    const week = scheduleData.weeks[currentWeek];
    if (!week) return;
    
    const courses = scheduleData.courses[currentWeek][currentDay] || [];
    
    // Mettre à jour le label avec le jour sélectionné
    const dayName = week.days[currentDay].name;
    const dayDate = week.days[currentDay].date;
    currentWeekLabel.textContent = `${dayName} ${dayDate}`;
    
    let html = '';
    week.timeSlots.forEach(time => {
        const course = courses.find(c => c.time === time);
        
        html += `
            <div class="schedule-item">
                <div class="schedule-time">${time}</div>
                <div class="schedule-course ${course ? course.color : 'empty'}">
                    ${course ? `
                        <div class="course-subject">${course.subject}</div>
                        <div class="course-teacher">${course.teacher}</div>
                        <div class="course-room">${course.room}</div>
                    ` : 'Pas de cours'}
                </div>
            </div>
        `;
    });
    
    scheduleContent.innerHTML = html;
}

async function previousDay() {
    if (currentDay > 0) {
        currentDay--;
        await loadSchedule();
    } else if (currentWeek > 0) {
        currentWeek--;
        currentDay = 4; // Vendredi de la semaine précédente
        await loadSchedule();
    }
}

async function nextDay() {
    if (currentDay < 4) {
        currentDay++;
        await loadSchedule();
    } else if (currentWeek < scheduleData.weeks.length - 1) {
        currentWeek++;
        currentDay = 0; // Lundi de la semaine suivante
        await loadSchedule();
    }
}

async function previousWeekVieScolaire() {
    if (currentWeekVieScolaire > 0) {
        currentWeekVieScolaire--;
        await loadVieScolaireSchedule();
    }
}

async function nextWeekVieScolaire() {
    if (currentWeekVieScolaire < scheduleData.weeks.length - 1) {
        currentWeekVieScolaire++;
        await loadVieScolaireSchedule();
    }
}

// Fonctions de chargement 
async function loadHomework() {
    const homeworkList = document.getElementById('homeworkList');
    const taskCount = document.getElementById('taskCount');
    
    if (!homeworkList || !taskCount) return;
    
    try {
        // Charger les devoirs depuis l'API
        const homeworkData = await loadData('homeworkData');
        
        if (homeworkData.length === 0) {
            homeworkList.innerHTML = `
                <div class="empty-state new-year">
                    <i class="fas fa-rocket"></i>
                    <h3>Bonne rentrée scolaire 2025 ! 🎓</h3>
                    <p>C'est le début d'une nouvelle année scolaire.</p>
                    <p>Vos professeurs n'ont pas encore donné de devoirs.</p>
                    <small>Profitez de cette période pour bien vous organiser !</small>
                </div>
            `;
            taskCount.textContent = 'Nouvelle année';
        } else {
            taskCount.textContent = homeworkData.length;
            
            let html = '';
            homeworkData.forEach((homework, index) => {
                const priorityClass = `priority-${homework.priority}`;
                const dueDate = new Date(homework.dueDate);
                const formattedDate = dueDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });
                
                html += `
                    <div class="homework-item ${priorityClass}">
                        <div class="homework-header">
                            <div class="homework-meta">
                                <span class="homework-subject">${homework.subject}</span>
                                <span class="homework-teacher">${homework.teacher}</span>
                            </div>
                            <div class="homework-due">
                                <div class="homework-due-label">À rendre pour le</div>
                                <div class="homework-due-date">${formattedDate}</div>
                            </div>
                        </div>
                        <div class="homework-title">${homework.title}</div>
                        <div class="homework-description">${homework.description}</div>
                    </div>
                `;
            });
            
            homeworkList.innerHTML = html;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des devoirs:', error);
        homeworkList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les devoirs.</p>
            </div>
        `;
        taskCount.textContent = 'Erreur';
    }
}

function loadResources() {
    const resourcesList = document.getElementById('resourcesList');
    
    if (!resourcesList) return;
    
    // Vide car c'est le début d'année
    resourcesList.innerHTML = `
        <div class="empty-state new-year">
            <i class="fas fa-books"></i>
            <h3>Ressources à venir</h3>
            <p>Vos professeurs ajouteront bientôt des ressources pédagogiques.</p>
            <small>Elles apparaîtront ici</small>
        </div>
    `;
}

function loadInfo() {
    const infoList = document.getElementById('infoList');
    
    if (!infoList) return;
    
    // Vide car c'est le début d'année
    infoList.innerHTML = `
        <div class="empty-state new-year">
            <i class="fas fa-bell"></i>
            <h3>Rentrée scolaire 2025</h3>
            <p>Bienvenue ! Les informations importantes apparaîtront ici.</p>
            <small>Bonne année scolaire !</small>
        </div>
    `;
}

// Page Mes données
function setupDataPageEvents() {
    // Gestionnaires pour la sidebar
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            showDataSection(section);
        });
    });
}

function showDataSection(section) {
    // Masquer toutes les sections
    const sections = document.querySelectorAll('.data-section');
    sections.forEach(s => s.classList.remove('active'));
    
    // Afficher la section demandée
    const targetSection = document.getElementById(section + 'Section');
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Mettre à jour la sidebar
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(item => {
        const itemSection = item.getAttribute('data-section');
        if (itemSection === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Gestion des mots de passe
function setupPasswordForm() {
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

function togglePasswordField(fieldId) {
    const field = document.getElementById(fieldId);
    const button = field.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (field.type === 'password') {
        field.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

async function handlePasswordChange(e) {
    e.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    const errorDiv = document.getElementById('passwordError');
    const errorText = document.getElementById('passwordErrorText');
    const successDiv = document.getElementById('passwordSuccess');
    
    // Masquer les messages précédents
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    // Validation
    if (!currentPassword) {
        showPasswordError('Veuillez saisir votre mot de passe actuel');
        return;
    }
    
    if (!newPassword) {
        showPasswordError('Veuillez saisir un nouveau mot de passe');
        return;
    }
    
    if (newPassword.length < 8) {
        showPasswordError('Le nouveau mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showPasswordError('Les nouveaux mots de passe ne correspondent pas');
        return;
    }
    
    if (currentPassword === newPassword) {
        showPasswordError('Le nouveau mot de passe doit être différent de l\'ancien');
        return;
    }
    
    // Vérifier le mot de passe actuel
    if (currentUser && currentUser.password !== currentPassword) {
        showPasswordError('Le mot de passe actuel est incorrect');
        return;
    }
    
    try {
        // Utiliser l'API pour changer le mot de passe
        const result = await apiClient.changePassword(currentUser.username, newPassword);
        
        if (result.success) {
            // Mettre à jour le mot de passe localement
            currentUser.password = newPassword;
            localStorage.setItem('pronote_user', JSON.stringify(currentUser));
            
            // Afficher le message de succès
            successDiv.style.display = 'flex';
            
            // Réinitialiser le formulaire
            document.getElementById('passwordForm').reset();
            
            // Masquer le message de succès après 5 secondes
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 5000);
        } else {
            showPasswordError('Erreur lors du changement de mot de passe');
        }
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        showPasswordError('Erreur de connexion au serveur');
    }
}

function showPasswordError(message) {
    const errorDiv = document.getElementById('passwordError');
    const errorText = document.getElementById('passwordErrorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
}

function resetPasswordForm() {
    document.getElementById('passwordForm').reset();
    document.getElementById('passwordError').style.display = 'none';
    document.getElementById('passwordSuccess').style.display = 'none';
}

// Page Notes
function setupNotesEvents() {
    // Events are handled in HTML with onclick for simplicity
}

async function loadNotesPage() {
    const notesDisplay = document.getElementById('notesDisplay');
    if (!notesDisplay) return;
    
    try {
        const notesData = await loadData('notesData');
        
        if (notesData.length === 0) {
            notesDisplay.innerHTML = `
                <div class="empty-state new-year">
                    <i class="fas fa-star"></i>
                    <h3>Nouvelle année, nouveau départ ! ⭐</h3>
                    <p>C'est le début d'une nouvelle année scolaire.</p>
                    <p>Vos notes apparaîtront ici au fur et à mesure des évaluations.</p>
                </div>
            `;
        } else {
            // Afficher les notes
            let html = '<div class="notes-grid">';
            notesData.forEach((note, index) => {
                html += `
                    <div class="note-item">
                        <div class="note-header">
                            <div class="note-subject">${note.subject}</div>
                            <div class="note-grade">${note.grade}/20</div>
                        </div>
                        <div class="note-teacher">${note.teacher}</div>
                        <div class="note-average">Moyenne classe: ${note.classAvg}/20</div>
                        <div class="note-appreciation">${note.appreciation}</div>
                    </div>
                `;
            });
            html += '</div>';
            notesDisplay.innerHTML = html;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        notesDisplay.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les notes.</p>
            </div>
        `;
    }
}

// Fonction pour changer d'onglet dans les notes
async function switchNotesTab(tab) {
    // Mettre à jour les boutons d'onglets
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mettre à jour le contenu
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(tab + 'Tab');
    if (activeContent) {
        activeContent.classList.add('active');
    }
    
    // Charger les bulletins si on clique sur l'onglet bulletins
    if (tab === 'bulletins') {
        await loadStudentBulletins();
    }
}


// Charger les bulletins côté élève
async function loadStudentBulletins() {
    const container = document.getElementById('studentBulletinsList');
    if (!container) return;
    
    try {
        let bulletins = await loadData("bulletinsData");

        if (bulletins.length === 0) {
            container.innerHTML = `
                <div class="empty-state new-year">
                    <i class="fas fa-file-pdf"></i>
                    <h3>Bulletins à venir 📋</h3>
                    <p>Les bulletins seront disponibles à la fin de chaque trimestre.</p>
                    <p>Premier bulletin attendu : fin décembre 2025</p>
                </div>
            `;
            return;
        }

        container.innerHTML = bulletins.map((bulletin, i) => `
            <div class="bulletin-item">
                <div class="bulletin-header">
                    <i class="fas fa-file-pdf"></i>
                    <h3>${bulletin.name}</h3>
                </div>
                <div class="bulletin-actions">
                    <button class="btn-primary" onclick="downloadBulletin('${bulletin.data}', '${bulletin.name}')">
                        <i class="fas fa-download"></i>
                        Télécharger
                    </button>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error('Erreur lors du chargement des bulletins:', error);
        container.innerHTML = `
            <div class="empty-state new-year">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les bulletins.</p>
            </div>
        `;
    }
}

// Télécharger un bulletin
function downloadBulletin(data, filename) {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Page Vie scolaire
async function loadVieScolairePage() {
    await loadVieScolaireSchedule();
}

async function loadVieScolaireSchedule() {
    const scheduleTable = document.getElementById('vieScolaireScheduleTable');
    const currentWeekLabel = document.getElementById('currentWeekLabelVieScolaire');
    
    // Mettre à jour les en-têtes des jours
    const mondayHeader = document.getElementById('mondayHeader');
    const tuesdayHeader = document.getElementById('tuesdayHeader');
    const wednesdayHeader = document.getElementById('wednesdayHeader');
    const thursdayHeader = document.getElementById('thursdayHeader');
    const fridayHeader = document.getElementById('fridayHeader');
    
    if (!scheduleTable || !currentWeekLabel) {
        return;
    }
    
    try {
        // Charger les données depuis l'API
        const scheduleDataFromAPI = await loadData('scheduleData');
        if (scheduleDataFromAPI && scheduleDataFromAPI.weeks && scheduleDataFromAPI.courses) {
            scheduleData.weeks = scheduleDataFromAPI.weeks;
            scheduleData.courses = scheduleDataFromAPI.courses;
        }
    } catch (error) {
        console.error('Erreur lors du chargement de l\'emploi du temps:', error);
    }
    
    const week = scheduleData.weeks[currentWeekVieScolaire];
    if (!week) return;
    
    let weekCourses = scheduleData.courses[currentWeekVieScolaire] || {};
    
    // Appliquer les absences de professeurs
    try {
        weekCourses = await applyAbsencesToSchedule(weekCourses);
    } catch (error) {
        console.error('Erreur lors de l\'application des absences:', error);
    }
    
    // Appliquer les absences d'élèves
    try {
        weekCourses = await applyStudentAbsencesToSchedule(weekCourses);
    } catch (error) {
        console.error('Erreur lors de l\'application des absences d\'élèves:', error);
    }

    
    // Mettre à jour le label de la semaine
    currentWeekLabel.textContent = week.label;
    
    // Mettre à jour les en-têtes avec les dates
    if (mondayHeader) mondayHeader.textContent = `${week.days[0].name} ${week.days[0].date}`;
    if (tuesdayHeader) tuesdayHeader.textContent = `${week.days[1].name} ${week.days[1].date}`;
    if (wednesdayHeader) wednesdayHeader.textContent = `${week.days[2].name} ${week.days[2].date}`;
    if (thursdayHeader) thursdayHeader.textContent = `${week.days[3].name} ${week.days[3].date}`;
    if (fridayHeader) fridayHeader.textContent = `${week.days[4].name} ${week.days[4].date}`;
    
    let html = '';
    
    // Générer les lignes pour chaque créneau horaire
    week.timeSlots.forEach(time => {
        html += `<tr>`;
        html += `<td class="time-slot">${time}</td>`;
        
        // Pour chaque jour de la semaine (Lundi à Vendredi)
        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            const dayCourses = weekCourses[dayIndex] || [];
            const courseAtTime = dayCourses.find(course => course.time === time);
            
            if (courseAtTime) {
                html += `
                    <td>
                        <div class="course-cell ${courseAtTime.color}">
                            <div class="course-info">
                                <div class="course-subject">${courseAtTime.subject}</div>
                                <div class="course-teacher">${courseAtTime.teacher}</div>
                                <div class="course-room">${courseAtTime.room}</div>
                            </div>
                        </div>
                    </td>
                `;
            } else {
                html += `<td class="empty-cell"></td>`;
            }
        }
        
        html += `</tr>`;
    });
    
    scheduleTable.innerHTML = html;
}

// Page Cahier de textes
function setupCahierTextesEvents() {
    // Events are handled in HTML with onclick for simplicity
}

async function loadCahierTextesPage() {
    // Load homework from admin panel
    const travailDisplay = document.getElementById('travailDisplay');
    if (!travailDisplay) return;
    
    try {
        const homeworkData = await loadData('homeworkData');
        
        if (homeworkData.length === 0) {
            travailDisplay.innerHTML = `
                <div class="empty-state new-year">
                    <i class="fas fa-rocket"></i>
                    <h3>C'est parti pour une nouvelle année ! 🚀</h3>
                    <p>Aucun travail à faire n'a été donné pour le moment.</p>
                    <p>Les premiers devoirs apparaîtront après le début des cours.</p>
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="location.reload();">Actualiser</button>
                        <button class="btn-secondary">Préparer l'organisation</button>
                    </div>
                </div>
            `;
        } else {
            let html = '<div class="homework-list">';
            homeworkData.forEach((homework, index) => {
                const priorityClass = `priority-${homework.priority}`;
                const dueDate = new Date(homework.dueDate);
                const formattedDate = dueDate.toLocaleDateString('fr-FR');
                
                html += `
                    <div class="homework-item ${priorityClass}">
                        <div class="homework-header">
                            <div class="homework-meta">
                                <span class="homework-subject">${homework.subject}</span>
                                <span class="homework-teacher">${homework.teacher}</span>
                            </div>
                            <div class="homework-due">
                                <div class="homework-due-label">Pour le</div>
                                <div class="homework-due-date">${formattedDate}</div>
                            </div>
                        </div>
                        <div class="homework-title">${homework.title}</div>
                        <div class="homework-description">${homework.description}</div>
                    </div>
                `;
            });
            html += '</div>';
            travailDisplay.innerHTML = html;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des devoirs:', error);
        travailDisplay.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les devoirs.</p>
            </div>
        `;
    }
}

async function switchCahierTextesTab(activeTab) {
    // Mettre à jour les boutons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === activeTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mettre à jour le contenu
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById(activeTab + 'Tab');
    if (activeContent) {
        activeContent.classList.add('active');
    }

    if (activeTab === 'travail') {
        await loadCahierTextesPage();
    }
}

// ============================
// FONCTIONS ADMIN
// ============================

async function loadAdminData() {
    await renderAdminData();
}
  

async function renderAdminData() {
    await renderAdminNotes();
    await renderAdminHomework();
    await renderBulletins();
    await renderAdminSchedule(); // 👉 affichage de l'emploi du temps
}

// Fonctions de compatibilité avec l'API
async function loadData(key) {
    try {
        switch(key) {
            case 'notesData':
                return await apiClient.getNotes();
            case 'homeworkData':
                return await apiClient.getHomework();
            case 'absenceData':
                return await apiClient.getAbsences();
            case 'bulletinsData':
                return await apiClient.getBulletins();
            case 'studentAbsencesData':
                return await apiClient.getStudentAbsences();
            case 'scheduleData':
                return await apiClient.getSchedule();
            default:
                console.warn(`Clé de données non reconnue: ${key}`);
                return [];
        }
    } catch (error) {
        console.error(`Erreur lors du chargement de ${key}:`, error);
        return [];
    }
}

// Fonctions API pour les notes
async function addNoteToAPI(noteData) {
    try {
        const result = await apiClient.addNote(noteData);
        return result.note;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        throw error;
    }
}

async function deleteNoteFromAPI(noteId) {
    try {
        await apiClient.deleteNote(noteId);
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        throw error;
    }
}

// Fonctions API pour les devoirs
async function addHomeworkToAPI(homeworkData) {
    try {
        const result = await apiClient.addHomework(homeworkData);
        return result.homework;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du devoir:', error);
        throw error;
    }
}

async function deleteHomeworkFromAPI(homeworkId) {
    try {
        await apiClient.deleteHomework(homeworkId);
    } catch (error) {
        console.error('Erreur lors de la suppression du devoir:', error);
        throw error;
    }
}

// Fonctions API pour les absences
async function addAbsenceToAPI(absenceData) {
    try {
        const result = await apiClient.addAbsence(absenceData);
        return result.absence;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence:', error);
        throw error;
    }
}

async function deleteAbsenceFromAPI(absenceId) {
    try {
        await apiClient.deleteAbsence(absenceId);
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence:', error);
        throw error;
    }
}

// Fonctions API pour les bulletins
async function addBulletinToAPI(bulletinData) {
    try {
        const result = await apiClient.addBulletin(bulletinData);
        return result.bulletin;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du bulletin:', error);
        throw error;
    }
}

async function deleteBulletinFromAPI(bulletinId) {
    try {
        await apiClient.deleteBulletin(bulletinId);
    } catch (error) {
        console.error('Erreur lors de la suppression du bulletin:', error);
        throw error;
    }
}

// Fonction API pour sauvegarder l'emploi du temps
async function saveScheduleToAPI(scheduleData) {
    try {
        await apiClient.saveSchedule(scheduleData);
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'emploi du temps:', error);
        throw error;
    }
}

// Gestion des onglets admin
function switchAdminTab(activeTab) {
    // Mettre à jour les boutons
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        if (btn.getAttribute('data-tab') === activeTab) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Mettre à jour le contenu
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const activeContent = document.getElementById('admin' + activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + 'Tab');
    if (activeContent) {
        activeContent.classList.add('active');
    }
}

// Notes Admin
function showAddNoteModal() {
    document.getElementById("addNoteModal").style.display = "block";
}

function hideAddNoteModal() {
    document.getElementById("addNoteModal").style.display = "none";
}

async function addNote(event) {
    event.preventDefault();

    const trimester = document.getElementById("noteTrimester").value;
    const subject = document.getElementById("noteSubject").value;
    const teacher = document.getElementById("noteTeacher").value;
    const grade = parseFloat(document.getElementById("studentGrade").value);
    const classAvg = parseFloat(document.getElementById("classAverage").value);
    const appreciation = document.getElementById("noteAppreciation").value;

    const noteData = { trimester, subject, teacher, grade, classAvg, appreciation };
    
    try {
        await addNoteToAPI(noteData);
        hideAddNoteModal();
        renderAdminNotes();
        
        // Reset form
        document.getElementById("addNoteForm").reset();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        alert('Erreur lors de l\'ajout de la note');
    }
}

async function renderAdminNotes() {
    const container = document.getElementById("adminNotesContainer");
    if (!container) return;
    
    try {
        let notes = await loadData("notesData");

        if (notes.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fas fa-star"></i>
                    <p>Aucune note ajoutée</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notes.map((n, i) => `
            <div class="admin-item">
                <div class="admin-item-header">
                    <strong>${n.subject}</strong>
                    <button class="delete-btn" onclick="deleteNote(${n.id || i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="admin-item-content">
                    <p><strong>Note:</strong> ${n.grade}/20 (Classe: ${n.classAvg}/20)</p>
                    <p><strong>Professeur:</strong> ${n.teacher}</p>
                    <p><strong>Appréciation:</strong> ${n.appreciation}</p>
                    <p><small><strong>Trimestre:</strong> ${n.trimester}</small></p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error('Erreur lors du chargement des notes:', error);
        container.innerHTML = `
            <div class="admin-empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des notes</p>
            </div>
        `;
    }
}

async function deleteNote(noteId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
        try {
            await deleteNoteFromAPI(noteId);
            renderAdminNotes();
        } catch (error) {
            console.error('Erreur lors de la suppression de la note:', error);
            alert('Erreur lors de la suppression de la note');
        }
    }
}

// Devoirs Admin
function showAddAdminHomeworkModal() {
    document.getElementById("addAdminHomeworkModal").style.display = "block";
}

function hideAddAdminHomeworkModal() {
    document.getElementById("addAdminHomeworkModal").style.display = "none";
}

async function addAdminHomework(event) {
    event.preventDefault();

    const subject = document.getElementById("adminHomeworkSubject").value;
    const teacher = document.getElementById("adminHomeworkTeacher").value;
    const title = document.getElementById("adminHomeworkTitle").value;
    const description = document.getElementById("adminHomeworkDescription").value;
    const dueDate = document.getElementById("adminHomeworkDueDate").value;
    const priority = document.getElementById("adminHomeworkPriority").value;

    const homeworkData = { subject, teacher, title, description, dueDate, priority };
    
    try {
        await addHomeworkToAPI(homeworkData);
        hideAddAdminHomeworkModal();
        renderAdminHomework();
        
        // Reset form
        document.getElementById("addAdminHomeworkForm").reset();
        
        // Update main page if visible
        if (currentPage === 'home') {
            loadHomework();
        }
    } catch (error) {
        console.error('Erreur lors de l\'ajout du devoir:', error);
        alert('Erreur lors de l\'ajout du devoir');
    }
}

async function renderAdminHomework() {
    const container = document.getElementById("adminHomeworkContainer");
    if (!container) return;
    
    try {
        let homeworks = await loadData("homeworkData");

        if (homeworks.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fas fa-tasks"></i>
                    <p>Aucun devoir ajouté</p>
                </div>
            `;
            return;
        }

        container.innerHTML = homeworks.map((h, i) => `
            <div class="admin-item">
                <div class="admin-item-header">
                    <strong>${h.subject} - ${h.title}</strong>
                    <button class="delete-btn" onclick="deleteHomework(${h.id || i})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="admin-item-content">
                    <p><strong>Professeur:</strong> ${h.teacher}</p>
                    <p><strong>Description:</strong> ${h.description}</p>
                    <p><strong>À rendre pour le:</strong> ${h.dueDate}</p>
                    <p><small><strong>Priorité:</strong> ${h.priority}</small></p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error('Erreur lors du chargement des devoirs:', error);
        container.innerHTML = `
            <div class="admin-empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des devoirs</p>
            </div>
        `;
    }
}

async function deleteHomework(homeworkId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce devoir ?')) {
        try {
            await deleteHomeworkFromAPI(homeworkId);
            renderAdminHomework();
            
            // Update main page if visible
            if (currentPage === 'home') {
                loadHomework();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression du devoir:', error);
            alert('Erreur lors de la suppression du devoir');
        }
    }
}

// Absences Admin
function showAddAbsenceModal() {
    document.getElementById("addAbsenceModal").style.display = "block";
}

function hideAddAbsenceModal() {
    document.getElementById("addAbsenceModal").style.display = "none";
}

async function addAbsence(event) {
    event.preventDefault();

    const teacher = document.getElementById("absenceTeacher").value;
    const date = document.getElementById("absenceDate").value;
    const reason = document.getElementById("absenceReason").value;

    const absenceData = { teacher, date, reason };
    
    try {
        await addAbsenceToAPI(absenceData);
        hideAddAbsenceModal();
        renderAdminAbsences();
        
        // Reset form
        document.getElementById("addAbsenceForm").reset();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence:', error);
        alert('Erreur lors de l\'ajout de l\'absence');
    }
}

async function renderAdminAbsences() {
    const container = document.getElementById("adminAbsenceContainer");
    if (!container) return;
    
    try {
        let absences = await loadData("absenceData");

        if (absences.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fas fa-user-times"></i>
                    <p>Aucune absence signalée</p>
                </div>
            `;
            return;
        }

        container.innerHTML = absences.map((a, i) => `
            <div class="admin-item">
                <div class="admin-item-header">
                    <strong>${a.teacher}</strong>
                    <button class="delete-btn" onclick="deleteAbsence(${a.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="admin-item-content">
                    <p><strong>Date:</strong> ${a.date}</p>
                    <p><strong>Raison:</strong> ${a.reason}</p>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error('Erreur lors du chargement des absences:', error);
        container.innerHTML = `
            <div class="admin-empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des absences</p>
            </div>
        `;
    }
}

async function deleteAbsence(absenceId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette absence ?')) {
        try {
            await deleteAbsenceFromAPI(absenceId);
            renderAdminAbsences();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'absence:', error);
            alert('Erreur lors de la suppression de l\'absence');
        }
    }
}
/* ==============================
   AFFICHAGE ABSENCES DANS L'EMPLOI DU TEMPS
   ============================== */
async function applyAbsencesToSchedule(weekCourses) {
    try {
        let absences = await loadData("absenceData");

        absences.forEach(abs => {
            let absentDate = new Date(abs.date);
            let dayIndex = absentDate.getDay() - 1; // lundi=0, mardi=1...

            if (dayIndex >= 0 && dayIndex < 5 && weekCourses[dayIndex]) {
                weekCourses[dayIndex] = weekCourses[dayIndex].map(course => {
                    if (course.teacher.toLowerCase().includes(abs.teacher.toLowerCase())) {
                        return {
                            ...course,
                            subject: course.subject + " (Prof absent)",
                            color: "bg-gray-300", // grisé
                            textColor: "text-gray-800"
                        };
                    }
                    return course;
                });
            }
        });

        return weekCourses;
    } catch (error) {
        console.error('Erreur lors du chargement des absences pour l\'emploi du temps:', error);
        return weekCourses;
    }
}

// Appliquer les absences d'élèves aux cours
async function applyStudentAbsencesToSchedule(weekCourses) {
    try {
        let studentAbsences = await loadData("studentAbsencesData");
        if (!studentAbsences || studentAbsences.length === 0) {
            return weekCourses;
        }

        studentAbsences.forEach(abs => {
            if (abs.student === currentUser.username && abs.status === 'validated') {
                let absentDate = new Date(abs.date);
                let dayIndex = absentDate.getDay() - 1; // lundi=0, mardi=1...

                if (dayIndex >= 0 && dayIndex < 5 && weekCourses[dayIndex]) {
                    weekCourses[dayIndex] = weekCourses[dayIndex].map(course => {
                        if (course.date === abs.date) {
                            return {
                                ...course,
                                subject: course.subject + ` (${abs.type === 'absence' ? 'Absent' : 'Retard'})`,
                                color: "bg-red-200", // rouge clair
                                textColor: "text-red-800"
                            };
                        }
                        return course;
                    });
                }
            }
        });

        return weekCourses;
    } catch (error) {
        console.error('Erreur lors du chargement des absences d\'élèves pour l\'emploi du temps:', error);
        return weekCourses;
    }
}


// Student homework management
function showAddHomeworkModal() {
    document.getElementById("addHomeworkModal").style.display = "block";
}

function hideAddHomeworkModal() {
    document.getElementById("addHomeworkModal").style.display = "none";
}

function addHomework(event) {
    event.preventDefault();

    const subject = document.getElementById("homeworkSubject").value;
    const teacher = document.getElementById("homeworkTeacher").value;
    const title = document.getElementById("homeworkTitle").value;
    const description = document.getElementById("homeworkDescription").value;
    const dueDate = document.getElementById("homeworkDueDate").value;
    const priority = document.getElementById("homeworkPriority").value;

    let homeworks = loadData("homeworkData");
    homeworks.push({ subject, teacher, title, description, dueDate, priority });
    saveData("homeworkData", homeworks);

    hideAddHomeworkModal();
    
    // Reset form
    document.getElementById("addHomeworkForm").reset();
    
    // Update display
    if (currentPage === 'home') {
        loadHomework();
    }
}

// Utilitaires
function formatDateFrench(date) {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName} ${day} ${month}`;
}

// Fermer les modals en cliquant à l'extérieur
document.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});
/* ============================
   ADMIN : Emploi du temps éditable
   ============================ */

  
  // Rend l'EDT pour l'admin (editable)
  async function renderAdminSchedule() {
    const tbody = document.getElementById('adminScheduleTableBody');
    const headerIds = ['adminMondayHeader','adminTuesdayHeader','adminWednesdayHeader','adminThursdayHeader','adminFridayHeader'];
    
    // Charger les données depuis l'API
    try {
      const scheduleDataFromAPI = await loadData("scheduleData");
      if (scheduleDataFromAPI && scheduleDataFromAPI.weeks && scheduleDataFromAPI.courses) {
        scheduleData.weeks = scheduleDataFromAPI.weeks;
        scheduleData.courses = scheduleDataFromAPI.courses;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps:', error);
    }
    
    const week = scheduleData.weeks[currentWeekVieScolaire];
    if (!tbody || !week) return;
  
    // mettre à jour en-têtes
    headerIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el && week.days && week.days[idx]) el.textContent = `${week.days[idx].name} ${week.days[idx].date || ''}`;
    });
  
    const weekCourses = scheduleData.courses[currentWeekVieScolaire] || {};
    const timeSlots = Array.isArray(week.timeSlots) ? week.timeSlots : ['08h00','09h00','10h10','11h10','12h10','13h10','14h10','15h15','16h15','17h15'];
  
    let html = '';
    timeSlots.forEach(time => {
      html += `<tr><td class="time-slot">${time}</td>`;
      for (let day = 0; day < 5; day++) {
        const dayArr = Array.isArray(weekCourses[day]) ? weekCourses[day] : [];
        const course = dayArr.find(c => c.time === time);
        if (course) {
          const absentLabel = course.absent ? '<div class="absent-badge">Prof. absent</div>' : '';
          const cancelledClass = course.cancelled ? 'course-cancelled' : '';
          html += `
            <td class="admin-course-cell ${cancelledClass}" data-day="${day}" data-time="${time}">
              ${absentLabel}
              <div class="course-cell ${course.color || ''}">
                <div class="course-subject">${course.subject}</div>
                <div class="course-teacher">${course.teacher}</div>
                <div class="course-room">${course.room}</div>
              </div>
            </td>`;
        } else {
          html += `<td class="empty-cell admin-empty-cell" data-day="${day}" data-time="${time}"></td>`;
        }
      }
      html += `</tr>`;
    });
  
    tbody.innerHTML = html;
  
    // attacher listeners sur les cases éditables
    document.querySelectorAll('#adminScheduleTableBody .admin-course-cell, #adminScheduleTableBody .admin-empty-cell').forEach(td=>{
      td.onclick = function() {
        const dayIndex = parseInt(this.dataset.day);
        const timeSlot = this.dataset.time;
        openEditCourseModal(currentWeekVieScolaire, dayIndex, timeSlot);
      };
    });
  }
  
  // Ouvre le modal et préremplit les champs
  function openEditCourseModal(weekIndex, dayIndex, timeSlot) {
    const weekCourses = scheduleData.courses[weekIndex] || {};
    let dayArr = weekCourses[dayIndex] || [];
    let course = dayArr.find(c => c.time === timeSlot);
  
    // si pas de course (case vide), on propose d'ajouter un cours simple
    if (!course) {
      course = { time: timeSlot, subject: 'Nouveau cours', teacher: '', room: '', color: '', absent: false, cancelled: false };
      // on n'ajoute pas encore au tableau avant sauvegarde
    }
  
    document.getElementById('edit_weekIndex').value = weekIndex;
    document.getElementById('edit_dayIndex').value = dayIndex;
    document.getElementById('edit_timeSlot').value = timeSlot;
  
    document.getElementById('edit_subject').value = course.subject || '';
    document.getElementById('edit_teacher').value = course.teacher || '';
    document.getElementById('edit_room').value = course.room || '';
    document.getElementById('edit_absent').checked = !!course.absent;
  
    // afficher modal
    document.getElementById('editCourseModal').style.display = 'block';
  }
  
  // Enregistrer les modifications faites par l'admin
  async function saveEditedCourse() {
    const weekIndex = parseInt(document.getElementById('edit_weekIndex').value);
    const dayIndex = parseInt(document.getElementById('edit_dayIndex').value);
    const timeSlot = document.getElementById('edit_timeSlot').value;
  
    const teacher = document.getElementById('edit_teacher').value.trim();
    const room = document.getElementById('edit_room').value.trim();
    const absent = document.getElementById('edit_absent').checked;
  
    // s'assurer que la structure existe
    scheduleData.courses = scheduleData.courses || [];
    scheduleData.courses[weekIndex] = scheduleData.courses[weekIndex] || {};
    scheduleData.courses[weekIndex][dayIndex] = scheduleData.courses[weekIndex][dayIndex] || [];
  
    let dayArr = scheduleData.courses[weekIndex][dayIndex];
    let course = dayArr.find(c => c.time === timeSlot);
  
    if (!course) {
      // créer et pousser
      course = { time: timeSlot, subject: document.getElementById('edit_subject').value || 'Cours', teacher, room, absent, cancelled:false };
      dayArr.push(course);
    } else {
      // modifier
      course.teacher = teacher;
      course.room = room;
      course.absent = absent;
      if (course.cancelled) course.cancelled = false; // si on ré-enregistre on annule l'annulation
    }
  
    try {
      // sauvegarder via l'API
      await saveScheduleToAPI(scheduleData);
      
      // Gérer l'absence du professeur
      if (absent) {
        const absenceData = {
          teacher: teacher,
          date: scheduleData.weeks[weekIndex].days[dayIndex].fullDate.toISOString().split('T')[0],
          reason: 'Absence signalée via l\'emploi du temps'
        };
        await addAbsenceToAPI(absenceData);
      } else {
        // Supprimer l'absence si elle existe
        try {
          const absences = await loadData('absenceData');
          const existingAbsence = absences.find(a => 
            a.teacher.toLowerCase().includes(teacher.toLowerCase()) &&
            a.date === scheduleData.weeks[weekIndex].days[dayIndex].fullDate.toISOString().split('T')[0]
          );
          if (existingAbsence) {
            await deleteAbsenceFromAPI(existingAbsence.id);
          }
        } catch (error) {
          console.error('Erreur lors de la suppression de l\'absence:', error);
        }
      }
      
      await renderAdminSchedule();
      // mettre à jour vue élève aussi
      if (typeof loadVieScolaireSchedule === 'function') await loadVieScolaireSchedule();
      
      closeEditCourseModal();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }
  
  // ferme modal
  function closeEditCourseModal() {
    document.getElementById('editCourseModal').style.display = 'none';
  }
  
  // annuler le cours (marquer cancelled)
  async function markCourseCancelled() {
    const weekIndex = parseInt(document.getElementById('edit_weekIndex').value);
    const dayIndex = parseInt(document.getElementById('edit_dayIndex').value);
    const timeSlot = document.getElementById('edit_timeSlot').value;
  
    scheduleData.courses = scheduleData.courses || [];
    scheduleData.courses[weekIndex] = scheduleData.courses[weekIndex] || {};
    scheduleData.courses[weekIndex][dayIndex] = scheduleData.courses[weekIndex][dayIndex] || [];
  
    let dayArr = scheduleData.courses[weekIndex][dayIndex];
    let course = dayArr.find(c => c.time === timeSlot);
  
    if (course) {
      course.cancelled = true;
      course.absent = false;
      
      try {
        await saveScheduleToAPI(scheduleData);
        await renderAdminSchedule();
        if (typeof loadVieScolaireSchedule === 'function') await loadVieScolaireSchedule();
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        alert('Erreur lors de la sauvegarde');
      }
    }
    closeEditCourseModal();
  }
  
  /* ==============================
   BULLETINS
   ============================== */
async function uploadBulletin(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const bulletinData = { name: file.name, data: e.target.result };
            await addBulletinToAPI(bulletinData);
            renderBulletins();
        } catch (error) {
            console.error('Erreur lors de l\'upload du bulletin:', error);
            alert('Erreur lors de l\'upload du bulletin');
        }
    };
    reader.readAsDataURL(file);
}

async function renderBulletins() {
    const container = document.getElementById("adminBulletinsContainer");
    if (!container) return;
    
    try {
        let bulletins = await loadData("bulletinsData");

        if (bulletins.length === 0) {
            container.innerHTML = `
                <div class="admin-empty-state">
                    <i class="fas fa-file-pdf"></i>
                    <p>Aucun bulletin ajouté</p>
                </div>
            `;
            return;
        }

        container.innerHTML = bulletins.map((b, i) => `
            <div class="admin-item">
                <div class="admin-item-header">
                    <a href="${b.data}" download="${b.name}" target="_blank">
                        📄 ${b.name}
                    </a>
                    <button class="delete-btn" onclick="deleteBulletin(${b.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join("");
    } catch (error) {
        console.error('Erreur lors du chargement des bulletins:', error);
        container.innerHTML = `
            <div class="admin-empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Erreur lors du chargement des bulletins</p>
            </div>
        `;
    }
}

async function deleteBulletin(bulletinId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce bulletin ?')) {
        try {
            await deleteBulletinFromAPI(bulletinId);
            renderBulletins();
        } catch (error) {
            console.error('Erreur lors de la suppression du bulletin:', error);
            alert('Erreur lors de la suppression du bulletin');
        }
    }
}

// ==============================
// GESTION DES ABSENCES D'ÉLÈVES
// ==============================

// Modal pour signaler une absence d'élève
function showAddStudentAbsenceModal() {
    document.getElementById("addStudentAbsenceModal").style.display = "block";
    // Définir la date d'aujourd'hui par défaut
    document.getElementById("studentAbsenceDate").value = new Date().toISOString().split('T')[0];
}

function hideAddStudentAbsenceModal() {
    document.getElementById("addStudentAbsenceModal").style.display = "none";
    document.getElementById("addStudentAbsenceForm").reset();
}

// Ajouter une absence d'élève
async function addStudentAbsence(event) {
    event.preventDefault();

    const date = document.getElementById("studentAbsenceDate").value;
    const type = document.getElementById("studentAbsenceType").value;
    const reason = document.getElementById("studentAbsenceReason").value;

    const absenceData = { 
        date, 
        type, 
        reason,
        student: currentUser.username,
        status: 'validated' // Directement validée par l'admin
    };
    
    try {
        await addStudentAbsenceToAPI(absenceData);
        hideAddStudentAbsenceModal();
        await loadStudentAbsences();
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence:', error);
        alert('Erreur lors de l\'ajout de l\'absence');
    }
}

// Charger les absences d'élèves
async function loadStudentAbsences() {
    const container = document.getElementById('studentAbsencesList');
    if (!container) return;
    
    try {
        let absences = await loadData("studentAbsencesData");
        
        // Filtrer les absences de l'élève connecté
        const studentAbsences = absences.filter(absence => 
            absence.student === currentUser.username
        );

        if (studentAbsences.length === 0) {
            container.innerHTML = `
                <div class="empty-state new-year">
                    <i class="fas fa-check-circle text-green-600"></i>
                    <h3>Excellente assiduité ! ✅</h3>
                    <p>Aucune absence enregistrée depuis la rentrée.</p>
                </div>
            `;
            return;
        }

        let html = '';
        studentAbsences.forEach((absence, index) => {
            const statusClass = absence.status === 'validated' ? 'validated' : 'pending';
            const statusText = absence.status === 'validated' ? 'Validée' : 'En attente';
            const statusIcon = absence.status === 'validated' ? 'fa-check-circle' : 'fa-clock';
            const typeText = absence.type === 'absence' ? 'Absence' : 'Retard';
            const typeIcon = absence.type === 'absence' ? 'fa-user-times' : 'fa-clock';
            
            html += `
                <div class="absence-item ${statusClass}">
                    <div class="absence-header">
                        <div class="absence-meta">
                            <span class="absence-type">
                                <i class="fas ${typeIcon}"></i>
                                ${typeText}
                            </span>
                            <span class="absence-date">${absence.date}</span>
                        </div>
                        <div class="absence-status">
                            <i class="fas ${statusIcon}"></i>
                            ${statusText}
                        </div>
                    </div>
                    <div class="absence-reason">${absence.reason}</div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    } catch (error) {
        console.error('Erreur lors du chargement des absences:', error);
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les absences.</p>
            </div>
        `;
    }
}

// Fonctions API pour les absences d'élèves
async function addStudentAbsenceToAPI(absenceData) {
    try {
        const result = await apiClient.addStudentAbsence(absenceData);
        return result.absence;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence d\'élève:', error);
        throw error;
    }
}

// Synchronisation en temps réel de l'emploi du temps
function startRealtimeSync() {
    // Actualiser l'emploi du temps toutes les 30 secondes
    setInterval(async () => {
        if (currentPage === 'vie-scolaire') {
            await loadVieScolaireSchedule();
        }
        if (currentUser && currentUser.role === 'admin') {
            await renderAdminSchedule();
        }
    }, 30000); // 30 secondes
}

// Initialiser la synchronisation en temps réel
document.addEventListener('DOMContentLoaded', function() {
    startRealtimeSync();
});


// Fonctions globales pour les événements onclick
window.togglePassword = togglePassword;
window.logout = logout;
window.toggleMobileMenu = toggleMobileMenu;
window.goToPage = goToPage;
window.previousDay = previousDay;
window.nextDay = nextDay;
window.previousWeekVieScolaire = previousWeekVieScolaire;
window.nextWeekVieScolaire = nextWeekVieScolaire;
window.togglePasswordField = togglePasswordField;
window.resetPasswordForm = resetPasswordForm;
window.switchNotesTab = switchNotesTab;
window.switchCahierTextesTab = switchCahierTextesTab;
window.switchAdminTab = switchAdminTab;
window.showAddNoteModal = showAddNoteModal;
window.hideAddNoteModal = hideAddNoteModal;
window.addNote = addNote;
window.deleteNote = deleteNote;
window.showAddAdminHomeworkModal = showAddAdminHomeworkModal;
window.hideAddAdminHomeworkModal = hideAddAdminHomeworkModal;
window.addAdminHomework = addAdminHomework;
window.deleteHomework = deleteHomework;
window.showAddAbsenceModal = showAddAbsenceModal;
window.hideAddAbsenceModal = hideAddAbsenceModal;
window.addAbsence = addAbsence;
window.deleteAbsence = deleteAbsence;
window.showAddHomeworkModal = showAddHomeworkModal;
window.hideAddHomeworkModal = hideAddHomeworkModal;
window.addHomework = addHomework;
window.showAddStudentAbsenceModal = showAddStudentAbsenceModal;
window.hideAddStudentAbsenceModal = hideAddStudentAbsenceModal;
window.addStudentAbsence = addStudentAbsence;
window.downloadBulletin = downloadBulletin;