import bcrypt from 'bcryptjs';

// 内存存储模拟数据库
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

const users: User[] = [];

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
  // 创建用户（注册）
  async createUser(credentials: UserCredentials) {
    // 检查邮箱是否已存在
    const existingUser = users.find(user => user.email === credentials.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(credentials.password, 10);

    // 创建新用户
    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      password: hashedPassword,
      name: credentials.name,
    };

    users.push(newUser);

    // 返回用户信息（不含密码）
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
  },

  // 用户登录
  async login(credentials: UserLogin) {
    // 查找用户
    const user = users.find(user => user.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // 返回用户信息（不含密码）
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  },

  // 根据ID获取用户
  async getUserById(id: string) {
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
