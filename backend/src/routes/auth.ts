import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { CreateUserInput } from '../types/user';
import { Request, Response } from 'express';

const router = Router();


import { UserModel, UserValidationError } from '../models/User';

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const userData = req.body as CreateUserInput;

    // Create user using UserModel
    const newUser = await UserModel.create(userData);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.user_id, username: newUser.username },
      process.env['JWT_SECRET'] || 'secretkey',
      { expiresIn: '1h' }
    );

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

// Health check route
router.get('/health', (_req, res) => {
  res.json({ message: 'Auth routes placeholder' });
});

export default router;
