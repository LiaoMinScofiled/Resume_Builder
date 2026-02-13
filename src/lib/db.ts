import bcrypt from 'bcryptjs';
import { promises as fs } from 'fs';
import path from 'path';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

export interface UserCredentials {
  email: string;
  password: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function loadUsers(): Promise<User[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export const userService = {
  async createUser(credentials: UserCredentials) {
    const users = await loadUsers();
    
    const existingUser = users.find(user => user.email === credentials.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      password: hashedPassword,
      name: credentials.name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await saveUsers(users);

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  },

  async login(credentials: UserLogin) {
    const users = await loadUsers();
    const user = users.find(user => user.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  async getUserById(id: string) {
    const users = await loadUsers();
    const user = users.find(user => user.id === id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },
};
