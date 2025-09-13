const express = require('express');
const cors = require('cors');

const app = express();

// Middleware basique
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Base de données simple en mémoire
let database = {
    users: [
        { id: 1, username: 'glodean.giorgiana', password: 'password', role: 'student' },
        { id: 2, username: 'admin', password: 'admin123', role: 'admin' }
    ],
    notes: [],
    homework: [],
    absences: [],
    bulletins: [],
    studentAbsences: [],
    scheduleData: { weeks: [], courses: {} }
};

// Routes API simples

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = database.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/change-password', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    const user = database.users.find(u => u.username === username && u.password === oldPassword);
    
    if (user) {
        user.password = newPassword;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid old password' });
    }
});

app.get('/api/notes', (req, res) => {
    res.json(database.notes || []);
});

app.post('/api/notes', (req, res) => {
    const newNote = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    database.notes.push(newNote);
    res.json({ success: true, note: newNote });
});

app.delete('/api/notes/:id', (req, res) => {
    database.notes = database.notes.filter(note => note.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.get('/api/homework', (req, res) => {
    res.json(database.homework || []);
});

app.post('/api/homework', (req, res) => {
    const newHomework = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    database.homework.push(newHomework);
    res.json({ success: true, homework: newHomework });
});

app.delete('/api/homework/:id', (req, res) => {
    database.homework = database.homework.filter(hw => hw.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.get('/api/absences', (req, res) => {
    res.json(database.absences || []);
});

app.post('/api/absences', (req, res) => {
    const newAbsence = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    database.absences.push(newAbsence);
    res.json({ success: true, absence: newAbsence });
});

app.delete('/api/absences/:id', (req, res) => {
    database.absences = database.absences.filter(absence => absence.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.get('/api/bulletins', (req, res) => {
    res.json(database.bulletins || []);
});

app.post('/api/bulletins', (req, res) => {
    const newBulletin = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    database.bulletins.push(newBulletin);
    res.json({ success: true, bulletin: newBulletin });
});

app.delete('/api/bulletins/:id', (req, res) => {
    database.bulletins = database.bulletins.filter(bulletin => bulletin.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.get('/api/student-absences', (req, res) => {
    res.json(database.studentAbsences || []);
});

app.post('/api/student-absences', (req, res) => {
    const newStudentAbsence = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
    database.studentAbsences.push(newStudentAbsence);
    res.json({ success: true, absence: newStudentAbsence });
});

app.delete('/api/student-absences/:id', (req, res) => {
    database.studentAbsences = database.studentAbsences.filter(absence => absence.id !== parseInt(req.params.id));
    res.json({ success: true });
});

app.get('/api/schedule', (req, res) => {
    res.json(database.scheduleData || { weeks: [], courses: {} });
});

app.post('/api/schedule', (req, res) => {
    database.scheduleData = req.body;
    res.json({ success: true });
});

// Routes pour servir les fichiers statiques
app.get('/style.css', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.send(`
        body { 
            font-family: Arial, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background-color: #f5f5f5;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .btn {
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        .btn:hover {
            background: #0056b3;
        }
    `);
});

app.get('/script.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        console.log('Script loaded successfully');
        // Script de base pour éviter les erreurs
        if (typeof window !== 'undefined') {
            window.addEventListener('DOMContentLoaded', function() {
                console.log('DOM loaded');
            });
        }
    `);
});

app.get('/api-client.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send(`
        class APIClient {
            constructor() {
                this.baseURL = '/api';
            }
            async request(endpoint, options = {}) {
                try {
                    const response = await fetch(this.baseURL + endpoint, options);
                    return response.json();
                } catch (error) {
                    console.error('API Error:', error);
                    return { error: 'Network error' };
                }
            }
            async login(username, password) {
                return this.request('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
            }
            async getNotes() {
                return this.request('/notes');
            }
            async addNote(note) {
                return this.request('/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(note)
                });
            }
            async deleteNote(id) {
                return this.request('/notes/' + id, { method: 'DELETE' });
            }
            async getHomework() {
                return this.request('/homework');
            }
            async addHomework(homework) {
                return this.request('/homework', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(homework)
                });
            }
            async deleteHomework(id) {
                return this.request('/homework/' + id, { method: 'DELETE' });
            }
            async getAbsences() {
                return this.request('/absences');
            }
            async addAbsence(absence) {
                return this.request('/absences', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(absence)
                });
            }
            async deleteAbsence(id) {
                return this.request('/absences/' + id, { method: 'DELETE' });
            }
            async getBulletins() {
                return this.request('/bulletins');
            }
            async addBulletin(bulletin) {
                return this.request('/bulletins', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bulletin)
                });
            }
            async deleteBulletin(id) {
                return this.request('/bulletins/' + id, { method: 'DELETE' });
            }
            async getStudentAbsences() {
                return this.request('/student-absences');
            }
            async addStudentAbsence(absence) {
                return this.request('/student-absences', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(absence)
                });
            }
            async deleteStudentAbsence(id) {
                return this.request('/student-absences/' + id, { method: 'DELETE' });
            }
            async getSchedule() {
                return this.request('/schedule');
            }
            async saveSchedule(scheduleData) {
                return this.request('/schedule', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(scheduleData)
                });
            }
        }
        window.apiClient = new APIClient();
    `);
});

// Route par défaut
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>School Portal</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <div class="container">
                <h1>School Portal</h1>
                <p>Application is working correctly!</p>
                <p>Server is running and responding to requests.</p>
                <button class="btn" onclick="testAPI()">Test API</button>
                <div id="result"></div>
            </div>
            <script src="/api-client.js"></script>
            <script src="/script.js"></script>
            <script>
                function testAPI() {
                    document.getElementById('result').innerHTML = 'Testing API...';
                    apiClient.getNotes().then(result => {
                        document.getElementById('result').innerHTML = 'API working! Notes: ' + result.length;
                    }).catch(error => {
                        document.getElementById('result').innerHTML = 'API Error: ' + error;
                    });
                }
            </script>
        </body>
        </html>
    `);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export pour Vercel
module.exports = app;
