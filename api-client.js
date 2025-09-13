// API Client pour remplacer localStorage
class APIClient {
    constructor() {
        this.baseURL = window.location.origin + '/api';
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Erreur de l\'API');
            }
            
            return data;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // Authentification
    async login(username, password) {
        return await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    async changePassword(userId, currentPassword, newPassword) {
        return await this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ userId, currentPassword, newPassword })
        });
    }

    // Notes
    async getNotes() {
        return await this.request('/notes');
    }

    async addNote(noteData) {
        return await this.request('/notes', {
            method: 'POST',
            body: JSON.stringify(noteData)
        });
    }

    async deleteNote(noteId) {
        return await this.request(`/notes/${noteId}`, {
            method: 'DELETE'
        });
    }

    // Devoirs
    async getHomework() {
        return await this.request('/homework');
    }

    async addHomework(homeworkData) {
        return await this.request('/homework', {
            method: 'POST',
            body: JSON.stringify(homeworkData)
        });
    }

    async deleteHomework(homeworkId) {
        return await this.request(`/homework/${homeworkId}`, {
            method: 'DELETE'
        });
    }

    // Absences
    async getAbsences() {
        return await this.request('/absences');
    }

    async addAbsence(absenceData) {
        return await this.request('/absences', {
            method: 'POST',
            body: JSON.stringify(absenceData)
        });
    }

    async deleteAbsence(absenceId) {
        return await this.request(`/absences/${absenceId}`, {
            method: 'DELETE'
        });
    }

    // Bulletins
    async getBulletins() {
        return await this.request('/bulletins');
    }

    async addBulletin(bulletinData) {
        return await this.request('/bulletins', {
            method: 'POST',
            body: JSON.stringify(bulletinData)
        });
    }

    async deleteBulletin(bulletinId) {
        return await this.request(`/bulletins/${bulletinId}`, {
            method: 'DELETE'
        });
    }

    // Absences d'élèves
    async getStudentAbsences() {
        return await this.request('/student-absences');
    }

    async addStudentAbsence(absenceData) {
        return await this.request('/student-absences', {
            method: 'POST',
            body: JSON.stringify(absenceData)
        });
    }

    async deleteStudentAbsence(absenceId) {
        return await this.request(`/student-absences/${absenceId}`, {
            method: 'DELETE'
        });
    }

    // Emploi du temps
    async getSchedule() {
        return await this.request('/schedule');
    }

    async saveSchedule(scheduleData) {
        return await this.request('/schedule', {
            method: 'PUT',
            body: JSON.stringify(scheduleData)
        });
    }
}

// Instance globale
const apiClient = new APIClient();

// Fonctions de compatibilité pour remplacer localStorage
async function loadData(key) {
    try {
        switch (key) {
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
                console.warn(`Clé non supportée: ${key}`);
                return [];
        }
    } catch (error) {
        console.error(`Erreur lors du chargement de ${key}:`, error);
        return [];
    }
}

async function saveData(key, data) {
    try {
        switch (key) {
            case 'scheduleData':
                await apiClient.saveSchedule(data);
                break;
            default:
                console.warn(`Sauvegarde non supportée pour ${key}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
    }
}

// Fonctions d'authentification
async function authenticateUser(username, password) {
    try {
        const result = await apiClient.login(username, password);
        if (result.success) {
            return result.user;
        }
        return null;
    } catch (error) {
        console.error('Erreur d\'authentification:', error);
        return null;
    }
}

async function changeUserPassword(userId, currentPassword, newPassword) {
    try {
        const result = await apiClient.changePassword(userId, currentPassword, newPassword);
        return result.success;
    } catch (error) {
        console.error('Erreur lors du changement de mot de passe:', error);
        return false;
    }
}

// Fonctions pour les notes
async function addNoteToAPI(noteData) {
    try {
        const result = await apiClient.addNote(noteData);
        return result.note;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la note:', error);
        return null;
    }
}

async function deleteNoteFromAPI(noteId) {
    try {
        await apiClient.deleteNote(noteId);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de la note:', error);
        return false;
    }
}

// Fonctions pour les devoirs
async function addHomeworkToAPI(homeworkData) {
    try {
        const result = await apiClient.addHomework(homeworkData);
        return result.homework;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du devoir:', error);
        return null;
    }
}

async function deleteHomeworkFromAPI(homeworkId) {
    try {
        await apiClient.deleteHomework(homeworkId);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du devoir:', error);
        return false;
    }
}

// Fonctions pour les absences
async function addAbsenceToAPI(absenceData) {
    try {
        const result = await apiClient.addAbsence(absenceData);
        return result.absence;
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'absence:', error);
        return null;
    }
}

async function deleteAbsenceFromAPI(absenceId) {
    try {
        await apiClient.deleteAbsence(absenceId);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'absence:', error);
        return false;
    }
}

// Fonctions pour les bulletins
async function addBulletinToAPI(bulletinData) {
    try {
        const result = await apiClient.addBulletin(bulletinData);
        return result.bulletin;
    } catch (error) {
        console.error('Erreur lors de l\'ajout du bulletin:', error);
        return null;
    }
}

async function deleteBulletinFromAPI(bulletinId) {
    try {
        await apiClient.deleteBulletin(bulletinId);
        return true;
    } catch (error) {
        console.error('Erreur lors de la suppression du bulletin:', error);
        return false;
    }
}

// Sauvegarder l'emploi du temps
async function saveScheduleToAPI() {
    try {
        await apiClient.saveSchedule(scheduleData);
        return true;
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'emploi du temps:', error);
        return false;
    }
}
