import jwtDecode from 'jwt-decode';

// Mock user data
const mockUsers = [
  {
    email: 'admin@wphhotel.com',
    password: 'Admin123!',
    name: 'Admin User',
    isAdmin: true
  },
  {
    email: 'user@example.com',
    password: 'User123!',
    name: 'Test User',
    isAdmin: false
  }
];

// Mock token generation
const generateToken = (user) => {
  const payload = {
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin
  };
  // This is a mock token, in a real app you'd use proper JWT signing
  return btoa(JSON.stringify(payload));
};

const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

export const login = async (email, password) => {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (user) {
    const token = generateToken(user);
    setAuthToken(token);
    return {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin
    };
  }
  
  throw new Error('Invalid email or password');
};

export const register = async (email, password, name) => {
  throw new Error('Registration is not implemented');
};

export const logout = () => {
  setAuthToken(null);
};

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      return JSON.parse(atob(token));
    }
    return null;
  } catch (error) {
    return null;
  }
};