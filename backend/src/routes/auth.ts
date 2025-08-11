import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { CreateUserInput } from '../types/user';
import { Request, Response } from 'express';
import { config } from '@/config/environment';
import { SignOptions } from 'jsonwebtoken';

const router = Router();


import { UserModel, UserValidationError } from '../models/User';

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const userData = req.body as CreateUserInput;

    // Create user using UserModel
    const newUser = await UserModel.create(userData);

    // Generate JWT token
    const payload = { 
      id: newUser.user_id, 
      email: newUser.email,
      role: 'user' // Default role
    };
    
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as any };
    
    const token = jwt.sign(payload, config.jwt.secret, options);

    // Return user info and token
    return res.status(201).json({
      message: 'User created successfully',
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
      },
      token,
    });
  } catch (error) {
    if (error instanceof UserValidationError) {
      return res.status(400).json({ error: error.message, field: error.field });
    }
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordValid = await UserModel.verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const payload = { 
      id: user.user_id, 
      email: user.email,
      role: 'user' // Default role, would be fetched from user roles in a real implementation
    };
    
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as any };
    
    const token = jwt.sign(payload, config.jwt.secret, options);

    // Update last login
    await UserModel.update(user.user_id, { last_login_at: new Date() } as any);

    return res.status(200).json({
      message: 'Signin successful',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check route
router.get('/health', (_req, res) => {
  res.json({ message: 'Auth routes placeholder' });
});

export default router;
