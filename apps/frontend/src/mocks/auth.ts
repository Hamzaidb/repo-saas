export type UserRole = 'buyer';

export type User = {
    id: string;
    email: string;
    name: string;
    roles: UserRole[];
    currentRole: UserRole; // Pour stocker le rôle actuellement sélectionné
};

// Utilisateur mocké
const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    roles: ['buyer'], // L'utilisateur a les deux rôles
    currentRole: 'buyer' // Rôle par défaut
};

const STORAGE_KEY = 'auth:user';

function saveStoredUser(user: User | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {}
}

function loadStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
  
export const authService = {
  currentUser: null as User | null,
  isAuthenticated: false,

  // Simuler une connexion
  async signIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          this.currentUser = mockUser;
          this.isAuthenticated = true;
          saveStoredUser(this.currentUser);
          resolve(mockUser);
        } else {
          reject(new Error('Email ou mot de passe incorrect'));
        }
      }, 1000);
    });
  },

  // Simuler une inscription
  async signUp(name: string, email: string, password: string): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          roles: ['buyer'],
          currentRole: 'buyer'
        };
        this.currentUser = newUser;
        this.isAuthenticated = true;
        saveStoredUser(this.currentUser);
        resolve(newUser);
      }, 1000);
    });
  },

  // Simuler une déconnexion
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.currentUser = null;
        this.isAuthenticated = false;
        saveStoredUser(null);
        resolve();
      }, 500);
    });
  },

  // Vérifier l'état d'authentification
  async getSession(): Promise<{ user: User | null }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.currentUser) {
          const stored = loadStoredUser();
          if (stored) {
            this.currentUser = stored;
            this.isAuthenticated = true;
          }
        }
        resolve({ user: this.currentUser });
      }, 200);
    });
  }
};