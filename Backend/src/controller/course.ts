import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export async function getCourses(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;

    try {
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        completions: { where: { userId } }
                    },
                    orderBy: { orderNumber: 'asc' }
                }
            }
        });

        const response = courses.map(course => ({
            id: course.id,
            title: course.title,
            description: course.description,
            modules: course.modules.map(mod => ({
                id: mod.id,
                title: mod.title,
                description: mod.description,
                isCompleted: mod.completions.length > 0
            })),
            progress: course.modules.length
                ? Math.round(100 * course.modules.filter(m => m.completions.length).length / course.modules.length)
                : 0
        }));

        res.json(response);
    } catch {
        res.status(500).json({ message: 'Error loading courses' });
    }
}


export async function getCourseModules(req: AuthRequest, res: Response) {
    const { courseId } = req.params;
    const userId = req.user!.userId;

    try {
        const modules = await prisma.module.findMany({
            where: { courseId: Number(courseId) },
            orderBy: { orderNumber: 'asc' },
            include: {
                completions: { where: { userId } }
            },
        });

        if (modules.length === 0) {
            return res.status(404).json({ message: 'Course not found or no modules available' });
        }

        const response = modules.map(mod => ({
            id: mod.id,
            title: mod.title,
            description: mod.description,
            orderNumber: mod.orderNumber,
            isCompleted: mod.completions.length > 0,
        }));

        res.json(response);
    } catch {
        res.status(500).json({ message: 'Error fetching modules' });
    }
}


export async function completeModule(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;
    const moduleId = Number(req.params.moduleId);

    try {
        await prisma.userModuleCompletion.upsert({
            where: {
                userId_moduleId: { userId, moduleId }
            },
            create: { userId, moduleId },
            update: {}
        });

        res.json({ message: 'Module marked as completed' });
    } catch {
        res.status(500).json({ message: 'Could not mark as completed' });
    }
}


export async function getUserProgress(req: AuthRequest, res: Response) {
    const userId = req.user!.userId;

    try {
        const courses = await prisma.course.findMany({
            include: {
                modules: {
                    select: { id: true }
                },
            }
        });

        const progressData = await Promise.all(courses.map(async (course) => {
            const totalModules = course.modules.length;
            const completedCount = await prisma.userModuleCompletion.count({
                where: {
                    userId,
                    moduleId: { in: course.modules.map(m => m.id) }
                }
            });
            const progress = totalModules ? Math.round((completedCount * 100) / totalModules) : 0;
            return {
                courseId: course.id,
                title: course.title,
                progress,
                totalModules,
                completedModules: completedCount,
            };
        }));

        res.json(progressData);
    } catch {
        res.status(500).json({ message: 'Error fetching progress' });
    }
}
