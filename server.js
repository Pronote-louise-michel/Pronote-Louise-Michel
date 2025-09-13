const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Chemin vers le fichier de base de données
const DB_PATH = path.join(__dirname, 'database.json');

// Initialiser la base de données si elle n'existe pas
async function initDatabase() {
    try {
        await fs.access(DB_PATH);
    } catch (error) {
        // Créer la base de données avec des données par défaut
        const defaultData = {
            users: [
                {
                    id: 1,
                    username: 'glodean.giorgiana',
                    password: 'password',
                    role: 'student'
                },
                {
                    id: 2,
                    username: 'admin',
                    password: 'admin123',
                    role: 'admin'
                }
            ],
            notes: [],
            homework: [],
            absences: [],
            bulletins: [],
            studentAbsences: [],
            scheduleData: {
                weeks: [],
                courses: {}
            }
        };
        
        await fs.writeFile(DB_PATH, JSON.stringify(defaultData, null, 2));
        console.log('Base de données initialisée');
    }
}

// Lire les données de la base
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lors de la lecture de la base de données:', error);
        return null;
    }
}

// Écrire les données dans la base
async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur lors de l\'écriture de la base de données:', error);
        return false;
    }
}

// Routes API

// Authentification
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const user = db.users.find(u => u.username === username && u.password === password);
    
    if (user) {
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    } else {
        res.status(401).json({ error: 'Identifiant ou mot de passe incorrect' });
    }
});

// Changer le mot de passe
app.post('/api/auth/change-password', async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const user = db.users.find(u => u.id === userId);
    if (!user || user.password !== currentPassword) {
        return res.status(400).json({ error: 'Mot de passe actuel incorrect' });
    }
    
    user.password = newPassword;
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

// Notes
app.get('/api/notes', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.notes);
});

app.post('/api/notes', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const newNote = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.notes.push(newNote);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true, note: newNote });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const noteId = parseInt(req.params.id);
    const noteIndex = db.notes.findIndex(n => n.id === noteId);
    
    if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note non trouvée' });
    }
    
    db.notes.splice(noteIndex, 1);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Devoirs
app.get('/api/homework', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.homework);
});

app.post('/api/homework', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const newHomework = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.homework.push(newHomework);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true, homework: newHomework });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

app.delete('/api/homework/:id', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const homeworkId = parseInt(req.params.id);
    const homeworkIndex = db.homework.findIndex(h => h.id === homeworkId);
    
    if (homeworkIndex === -1) {
        return res.status(404).json({ error: 'Devoir non trouvé' });
    }
    
    db.homework.splice(homeworkIndex, 1);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Absences
app.get('/api/absences', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.absences);
});

app.post('/api/absences', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const newAbsence = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.absences.push(newAbsence);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true, absence: newAbsence });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

app.delete('/api/absences/:id', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const absenceId = parseInt(req.params.id);
    const absenceIndex = db.absences.findIndex(a => a.id === absenceId);
    
    if (absenceIndex === -1) {
        return res.status(404).json({ error: 'Absence non trouvée' });
    }
    
    db.absences.splice(absenceIndex, 1);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Bulletins
app.get('/api/bulletins', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.bulletins);
});

app.post('/api/bulletins', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const newBulletin = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.bulletins.push(newBulletin);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true, bulletin: newBulletin });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

app.delete('/api/bulletins/:id', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const bulletinId = parseInt(req.params.id);
    const bulletinIndex = db.bulletins.findIndex(b => b.id === bulletinId);
    
    if (bulletinIndex === -1) {
        return res.status(404).json({ error: 'Bulletin non trouvé' });
    }
    
    db.bulletins.splice(bulletinIndex, 1);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Absences d'élèves
app.get('/api/student-absences', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.studentAbsences || []);
});

app.post('/api/student-absences', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    // S'assurer que studentAbsences existe
    if (!db.studentAbsences) {
        db.studentAbsences = [];
    }
    
    const newStudentAbsence = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.studentAbsences.push(newStudentAbsence);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true, absence: newStudentAbsence });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

app.delete('/api/student-absences/:id', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    const absenceId = parseInt(req.params.id);
    const absenceIndex = db.studentAbsences.findIndex(a => a.id === absenceId);
    
    if (absenceIndex === -1) {
        return res.status(404).json({ error: 'Absence non trouvée' });
    }
    
    db.studentAbsences.splice(absenceIndex, 1);
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

// Emploi du temps
app.get('/api/schedule', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    res.json(db.scheduleData);
});

app.put('/api/schedule', async (req, res) => {
    const db = await readDatabase();
    if (!db) {
        return res.status(500).json({ error: 'Erreur de base de données' });
    }
    
    db.scheduleData = req.body;
    
    const success = await writeDatabase(db);
    if (success) {
        res.json({ success: true });
    } else {
        res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
    }
});

// Route par défaut pour servir l'application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Démarrer le serveur
async function startServer() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
        console.log(`Application accessible sur http://localhost:${PORT}`);
    });
}

startServer().catch(console.error);
