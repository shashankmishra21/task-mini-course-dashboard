import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



export async function register(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) return res.status(409).json({ message: 'User exists' });

        const passwordHash = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({ data: { email, passwordHash } });
        res.status(201).json({ id: user.id, email: user.email });
    }
    catch {
        res.status(500).json({ message: 'Registration error' });
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!(await bcrypt.compare(password, user.passwordHash)))
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        res.json({ token, user: { id: user.id, email: user.email } });
    } 
    catch {
        res.status(500).json({ message: 'Login error' });
    }
}
