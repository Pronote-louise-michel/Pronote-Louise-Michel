@echo off
echo Démarrage de l'application Pronote...
echo.

REM Vérifier si Node.js est installé
node --version >nul 2>&1
if errorlevel 1 (
    echo ERREUR: Node.js n'est pas installé ou n'est pas dans le PATH
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b 1
)

REM Vérifier si les dépendances sont installées
if not exist "node_modules" (
    echo Installation des dépendances...
    npm install
    if errorlevel 1 (
        echo ERREUR: Impossible d'installer les dépendances
        pause
        exit /b 1
    )
)

REM Démarrer l'application
echo Démarrage du serveur sur http://localhost:3000
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.
node server.js

pause
