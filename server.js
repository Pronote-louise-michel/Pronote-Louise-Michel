const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Base de données en mémoire
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

// Routes API
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

// Servir les fichiers statiques avec gestion d'erreurs
app.get('/style.css', async (req, res) => {
    try {
        const cssContent = await fs.readFile(path.join(__dirname, 'style.css'), 'utf8');
        res.setHeader('Content-Type', 'text/css');
        res.send(cssContent);
    } catch (error) {
        res.status(404).send('/* CSS file not found */');
    }
});

app.get('/script.js', async (req, res) => {
    try {
        const jsContent = await fs.readFile(path.join(__dirname, 'script.js'), 'utf8');
        res.setHeader('Content-Type', 'application/javascript');
        res.send(jsContent);
    } catch (error) {
        res.status(404).send('// Script file not found');
    }
});

app.get('/api-client.js', async (req, res) => {
    try {
        const jsContent = await fs.readFile(path.join(__dirname, 'api-client.js'), 'utf8');
        res.setHeader('Content-Type', 'application/javascript');
        res.send(jsContent);
    } catch (error) {
        res.status(404).send('// API client file not found');
    }
});

// Servir les autres fichiers statiques
app.use(express.static('.'));

// Route par défaut
app.get('/', async (req, res) => {
    try {
        const htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        // HTML de fallback si le fichier n'existe pas
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>School Portal</title>
                <style>
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
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>School Portal</h1>
                    <p>Application is loading...</p>
                    <p>If you see this message, the server is working correctly.</p>
                </div>
                <script src="/api-client.js"></script>
                <script src="/script.js"></script>
            </body>
            </html>
        `);
    }
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export pour Vercel
module.exports = app;
