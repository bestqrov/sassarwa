import { Request, Response } from 'express';
import * as teachersService from './teachers.service';
import { sendSuccess, sendError } from '../../utils/response';

export const createTeacher = async (req: Request, res: Response) => {
    try {
        const teacherData = req.body;

        // Generate password if not provided
        let generatedPassword = teacherData.password;
        if (!generatedPassword) {
            // Generate a random password: first letter of name + random numbers
            const firstLetter = teacherData.name.charAt(0).toUpperCase();
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            generatedPassword = `${firstLetter}${randomNum}`;
        }

        const teacher = await teachersService.createTeacher({
            ...teacherData,
            password: generatedPassword
        });

        // Return teacher data with the generated password (for admin to see)
        const responseData = {
            ...teacher,
            generatedPassword: generatedPassword
        };

        sendSuccess(res, responseData, 'Teacher created successfully', 201);
    } catch (error: any) {
        sendError(res, error.message, 'Failed to create teacher', 400);
    }
};

export const getAllTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await teachersService.getAllTeachers();
        sendSuccess(res, teachers, 'Teachers retrieved successfully');
    } catch (error: any) {
        sendError(res, error.message, 'Failed to retrieve teachers');
    }
};

export const updateTeacher = async (req: Request, res: Response) => {
    try {
        const teacher = await teachersService.updateTeacher(req.params.id, req.body);
        sendSuccess(res, teacher, 'Teacher updated successfully');
    } catch (error: any) {
        sendError(res, error.message, 'Failed to update teacher', 400);
    }
};

export const deleteTeacher = async (req: Request, res: Response) => {
    try {
        await teachersService.deleteTeacher(req.params.id);
        sendSuccess(res, null, 'Teacher deleted successfully');
    } catch (error: any) {
        sendError(res, error.message, 'Failed to delete teacher', 400);
    }
};
