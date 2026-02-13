import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase: any = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.warn('Failed to initialize Supabase client:', error);
  }
}

export interface UserCredentials {
  email: string;
  password: string;
  name: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export const userService = {
  async createUser(credentials: UserCredentials) {
    if (!supabase) {
      throw new Error('Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: Date.now().toString(),
          email: credentials.email,
          password: hashedPassword,
          name: credentials.name,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error('Email already exists');
      }
      throw new Error(error.message);
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
    };
  },

  async login(credentials: UserLogin) {
    if (!supabase) {
      throw new Error('Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single();

    if (error || !data) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, data.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
    };
  },

  async getUserById(id: string) {
    if (!supabase) {
      throw new Error('Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error('User not found');
    }

    return {
      id: data.id,
      email: data.email,
      name: data.name,
    };
  },
};
