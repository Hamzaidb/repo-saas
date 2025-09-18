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
          resolve();
        }, 500);
      });
    },
  
    // Vérifier l'état d'authentification
    async getSession(): Promise<{ user: User | null }> {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ user: this.currentUser });
        }, 200);
      });
    }
  };