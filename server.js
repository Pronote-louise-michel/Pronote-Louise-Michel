const express = require('express');
const cors = require('cors');

const app = express();

// Middleware basique
app.use(cors());
app.use(express.json());

// Base de données en mémoire
let db = {
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

// Route de test
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// API Routes
app.post('/api/login', (req, res) => {
    try {
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

app.get('/api/:dataType', (req, res) => {
    try {
        const { dataType } = req.params;
        if (db[dataType]) {
            res.json(db[dataType]);
        } else {
            res.status(404).json({ error: 'Data type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/:dataType', (req, res) => {
    try {
        const { dataType } = req.params;
        if (db[dataType]) {
            const newItem = { id: Date.now(), ...req.body, createdAt: new Date().toISOString() };
            db[dataType].push(newItem);
            res.json({ success: true, item: newItem });
        } else {
            res.status(404).json({ error: 'Data type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/:dataType/:id', (req, res) => {
    try {
        const { dataType, id } = req.params;
        if (db[dataType]) {
            const initialLength = db[dataType].length;
            db[dataType] = db[dataType].filter(item => item.id !== parseInt(id));
            if (db[dataType].length < initialLength) {
                res.json({ success: true });
            } else {
                res.status(404).json({ error: 'Item not found' });
            }
        } else {
            res.status(404).json({ error: 'Data type not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route par défaut - HTML simple
app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Portail Scolaire</title>
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
                .login-form {
                    max-width: 400px;
                    margin: 50px auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                }
                .form-group {
                    margin-bottom: 15px;
                }
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .error {
                    color: red;
                    margin-top: 10px;
                }
                .success {
                    color: green;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Portail Scolaire</h1>
                <div class="login-form">
                    <h2>Connexion</h2>
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Nom d'utilisateur:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Mot de passe:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Se connecter</button>
                    </form>
                    <div id="message"></div>
                </div>
                
                <div style="margin-top: 30px; padding: 20px; background-color: #e9ecef; border-radius: 8px;">
                    <h3>Test de connexion serveur</h3>
                    <button onclick="testServer()">Tester le serveur</button>
                    <div id="serverTest"></div>
                </div>
            </div>

            <script>
                // Test de connexion serveur
                async function testServer() {
                    const testDiv = document.getElementById('serverTest');
                    testDiv.innerHTML = 'Test en cours...';
                    
                    try {
                        const response = await fetch('/test');
                        const data = await response.json();
                        testDiv.innerHTML = '<div style="color: green;">✅ Serveur fonctionne: ' + data.message + '</div>';
                    } catch (error) {
                        testDiv.innerHTML = '<div style="color: red;">❌ Erreur serveur: ' + error.message + '</div>';
                    }
                }

                // Connexion
                document.getElementById('loginForm').addEventListener('submit', async function(e) {
                    e.preventDefault();
                    
                    const username = document.getElementById('username').value;
                    const password = document.getElementById('password').value;
                    const messageDiv = document.getElementById('message');
                    
                    try {
                        const response = await fetch('/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username, password })
                        });
                        
                        const data = await response.json();
                        
                        if (data.success) {
                            messageDiv.innerHTML = '<div class="success">✅ Connexion réussie! Rôle: ' + data.user.role + '</div>';
                        } else {
                            messageDiv.innerHTML = '<div class="error">❌ Identifiants incorrects</div>';
                        }
                    } catch (error) {
                        messageDiv.innerHTML = '<div class="error">❌ Erreur de connexion: ' + error.message + '</div>';
                    }
                });

                // Test automatique au chargement
                window.addEventListener('load', testServer);
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
