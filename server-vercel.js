const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware avec gestion d'erreurs
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// Middleware de gestion d'erreurs global
app.use((error, req, res, next) => {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

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

// Lire la base de données
async function readDatabase() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erreur lecture base de données:', error);
        return null;
    }
}

// Écrire dans la base de données
async function writeDatabase(data) {
    try {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Erreur écriture base de données:', error);
        return false;
    }
}

// Routes API avec gestion d'erreurs

// Authentification
app.post('/api/login', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        const { username, password } = req.body;
        const user = db.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.json({ success: true, user: { id: user.id, username: user.username, role: user.role } });
        } else {
            res.status(401).json({ error: 'Identifiants incorrects' });
        }
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Changer le mot de passe
app.post('/api/change-password', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        const { username, oldPassword, newPassword } = req.body;
        const user = db.users.find(u => u.username === username && u.password === oldPassword);
        
        if (user) {
            user.password = newPassword;
            const success = await writeDatabase(db);
            if (success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
            }
        } else {
            res.status(401).json({ error: 'Ancien mot de passe incorrect' });
        }
    } catch (error) {
        console.error('Erreur change-password:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Notes
app.get('/api/notes', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.notes || []);
    } catch (error) {
        console.error('Erreur GET notes:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.notes) {
            db.notes = [];
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
    } catch (error) {
        console.error('Erreur POST notes:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.notes) {
            db.notes = [];
        }
        
        db.notes = db.notes.filter(note => note.id !== parseInt(req.params.id));
        const success = await writeDatabase(db);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur DELETE notes:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Devoirs
app.get('/api/homework', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.homework || []);
    } catch (error) {
        console.error('Erreur GET homework:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/homework', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.homework) {
            db.homework = [];
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
    } catch (error) {
        console.error('Erreur POST homework:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.delete('/api/homework/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.homework) {
            db.homework = [];
        }
        
        db.homework = db.homework.filter(hw => hw.id !== parseInt(req.params.id));
        const success = await writeDatabase(db);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur DELETE homework:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Absences professeurs
app.get('/api/absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.absences || []);
    } catch (error) {
        console.error('Erreur GET absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.absences) {
            db.absences = [];
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
    } catch (error) {
        console.error('Erreur POST absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.delete('/api/absences/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.absences) {
            db.absences = [];
        }
        
        db.absences = db.absences.filter(absence => absence.id !== parseInt(req.params.id));
        const success = await writeDatabase(db);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur DELETE absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Bulletins
app.get('/api/bulletins', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.bulletins || []);
    } catch (error) {
        console.error('Erreur GET bulletins:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/bulletins', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.bulletins) {
            db.bulletins = [];
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
    } catch (error) {
        console.error('Erreur POST bulletins:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.delete('/api/bulletins/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.bulletins) {
            db.bulletins = [];
        }
        
        db.bulletins = db.bulletins.filter(bulletin => bulletin.id !== parseInt(req.params.id));
        const success = await writeDatabase(db);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur DELETE bulletins:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Absences d'élèves
app.get('/api/student-absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.studentAbsences || []);
    } catch (error) {
        console.error('Erreur GET student-absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/student-absences', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
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
    } catch (error) {
        console.error('Erreur POST student-absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.delete('/api/student-absences/:id', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        
        if (!db.studentAbsences) {
            db.studentAbsences = [];
        }
        
        db.studentAbsences = db.studentAbsences.filter(absence => absence.id !== parseInt(req.params.id));
        const success = await writeDatabase(db);
        if (success) {
            res.json({ success: true });
        } else {
            res.status(500).json({ error: 'Erreur lors de la sauvegarde' });
        }
    } catch (error) {
        console.error('Erreur DELETE student-absences:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Emploi du temps
app.get('/api/schedule', async (req, res) => {
    try {
        const db = await readDatabase();
        if (!db) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        res.json(db.scheduleData || { weeks: [], courses: {} });
    } catch (error) {
        console.error('Erreur GET schedule:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

app.post('/api/schedule', async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Erreur POST schedule:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Route par défaut
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Initialiser la base de données et démarrer le serveur
async function startServer() {
    await initDatabase();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur le port ${PORT}`);
        console.log(`Application accessible sur http://localhost:${PORT}`);
    });
}

// Démarrer le serveur
startServer().catch(console.error);

// Export pour Vercel
module.exports = app;
