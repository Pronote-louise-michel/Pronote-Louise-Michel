const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, 'database.json');

// Initialiser la base de données
async function initDatabase() {
    try {
        await fs.access(DB_PATH);
    } catch (error) {
        const defaultData = {
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
        await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
    }
}

// Lire la base de données
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
}

// Écrire dans la base de données
async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
}

// Routes API

// Login
app.post('/api/login', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        const { username, password } = req.body;
        const user = db.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Change password
app.post('/api/change-password', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        const { username, oldPassword, newPassword } = req.body;
        const user = db.users.find(u => u.username === username && u.password === oldPassword);
        
        if (user) {
            user.password = newPassword;
            await writeDatabase(db);
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid old password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Notes
app.get('/api/notes', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.notes || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.notes) db.notes = [];
        
        const newNote = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        db.notes.push(newNote);
        await writeDatabase(db);
        res.json({ success: true, note: newNote });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.notes) db.notes = [];
        db.notes = db.notes.filter(note => note.id !== parseInt(req.params.id));
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Homework
app.get('/api/homework', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.homework || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/homework', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.homework) db.homework = [];
        
        const newHomework = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        db.homework.push(newHomework);
        await writeDatabase(db);
        res.json({ success: true, homework: newHomework });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/homework/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.homework) db.homework = [];
        db.homework = db.homework.filter(hw => hw.id !== parseInt(req.params.id));
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Absences
app.get('/api/absences', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.absences || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.absences) db.absences = [];
        
        const newAbsence = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        db.absences.push(newAbsence);
        await writeDatabase(db);
        res.json({ success: true, absence: newAbsence });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/absences/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.absences) db.absences = [];
        db.absences = db.absences.filter(absence => absence.id !== parseInt(req.params.id));
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Bulletins
app.get('/api/bulletins', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.bulletins || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/bulletins', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.bulletins) db.bulletins = [];
        
        const newBulletin = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        db.bulletins.push(newBulletin);
        await writeDatabase(db);
        res.json({ success: true, bulletin: newBulletin });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/bulletins/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.bulletins) db.bulletins = [];
        db.bulletins = db.bulletins.filter(bulletin => bulletin.id !== parseInt(req.params.id));
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Student absences
app.get('/api/student-absences', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.studentAbsences || []);
    } catch (error) {
        res.json([]);
    }
});

app.post('/api/student-absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.studentAbsences) db.studentAbsences = [];
        
        const newStudentAbsence = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
        db.studentAbsences.push(newStudentAbsence);
        await writeDatabase(db);
        res.json({ success: true, absence: newStudentAbsence });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/student-absences/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        if (!db.studentAbsences) db.studentAbsences = [];
        db.studentAbsences = db.studentAbsences.filter(absence => absence.id !== parseInt(req.params.id));
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Schedule
app.get('/api/schedule', async (req, res) => {
    try {
        const db = await readDatabase();
        res.json(db?.scheduleData || { weeks: [], courses: {} });
    } catch (error) {
        res.json({ weeks: [], courses: {} });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) return res.status(500).json({ error: 'Database error' });
        
        db.scheduleData = req.body;
        await writeDatabase(db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Routes pour servir les fichiers statiques avec fallback
app.get('/style.css', async (req, res) => {
    try {
        const cssContent = await fs.readFile(path.join(__dirname, 'style.css'), 'utf8');
        res.setHeader('Content-Type', 'text/css');
        res.send(cssContent);
    } catch (error) {
        // Fallback CSS minimal
        res.setHeader('Content-Type', 'text/css');
        res.send('body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }');
    }
});

app.get('/script.js', async (req, res) => {
    try {
        const jsContent = await fs.readFile(path.join(__dirname, 'script.js'), 'utf8');
        res.setHeader('Content-Type', 'application/javascript');
        res.send(jsContent);
    } catch (error) {
        // Fallback JS minimal
        res.setHeader('Content-Type', 'application/javascript');
        res.send('console.log("Script loaded");');
    }
});

app.get('/api-client.js', async (req, res) => {
    try {
        const jsContent = await fs.readFile(path.join(__dirname, 'api-client.js'), 'utf8');
        res.setHeader('Content-Type', 'application/javascript');
        res.send(jsContent);
    } catch (error) {
        // Fallback API client minimal
        res.setHeader('Content-Type', 'application/javascript');
        res.send('class APIClient { constructor() { this.baseURL = "/api"; } }');
    }
});

// Route par défaut avec fallback
app.get('/', async (req, res) => {
    try {
        const htmlContent = await fs.readFile(path.join(__dirname, 'index.html'), 'utf8');
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        // Fallback HTML minimal
        res.setHeader('Content-Type', 'text/html');
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>School Portal</title>
                <link rel="stylesheet" href="/style.css">
            </head>
            <body>
                <h1>School Portal</h1>
                <p>Application is loading...</p>
                <script src="/api-client.js"></script>
                <script src="/script.js"></script>
            </body>
            </html>
        `);
    }
});

// Initialiser et démarrer
async function startServer() {
    await initDatabase();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Démarrer le serveur
startServer().catch(console.error);

// Export pour Vercel
module.exports = app;
