import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Staff } from '../models/staff';
import { Admin } from '../models/admin';
import { Complaint } from '../models/complaint';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

export const register = async (req: Request, res: Response) => {
    // Registration is only for public Users
    const { name, email, password, contact_info } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            contact_info,
        });

        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`[Login Attempt] Email: ${email}`);

    try {
        let user: any = null;
        let role = '';

        // Check Admin table first
        const admin = await Admin.findOne({ where: { email } });
        if (admin) {
            console.log('[Login] Found in Admin table');
            user = admin;
            role = 'Admin';
        }

        // If not Admin, check Staff
        if (!user) {
            const staff = await Staff.findOne({ where: { email } });
            if (staff) {
                console.log('[Login] Found in Staff table');
                user = staff;
                role = 'Staff';
            }
        }

        // If not Staff, check User
        if (!user) {
            const normalUser = await User.findOne({ where: { email } });
            if (normalUser) {
                console.log('[Login] Found in User table');
                user = normalUser;
                role = 'User';
            }
        }

        if (!user) {
            console.log('[Login] User not found in any table');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log(`[Login] Password match: ${isMatch}`);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role, userId: user.id, name: user.name });
    } catch (error) {
        console.error('[Login] Error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getAllStaff = async (req: Request, res: Response) => {
    try {
        const staff = await Staff.findAll({
            attributes: ['id', 'name', 'email', 'department']
        });

        // Check for active assignments
        const staffWithStatus = await Promise.all(staff.map(async (s) => {
            const activeComplaint = await Complaint.findOne({
                where: {
                    staffId: s.id,
                    status: { [Op.not]: 'Resolved' }
                }
            });
            return {
                ...s.toJSON(),
                isBusy: !!activeComplaint
            };
        }));

        res.json(staffWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching staff', error });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'contact_info', 'createdAt']
        });
        // Frontend expects 'role' property for display
        const usersWithRole = users.map(u => ({ ...u.toJSON(), role: 'User' }));
        res.json(usersWithRole);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Simplified role update - mostly to create staff/admins from existing users? 
// Or actually, this feature might be complex now. 
// For now, let's say we can't easily "change role" because it means moving tables.
// We'll disable this or implementing it as a deletion + creation.
export const updateUserRole = async (req: Request, res: Response) => {
    res.status(501).json({ message: 'Role update temporarily disabled due to architecture change.' });
};

// Seed function to create initial admin if not exists (Verified manually for now)
export const seedAdmin = async () => {
    try {
        const count = await Admin.count();
        if (count === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await Admin.create({
                name: 'System Admin',
                email: 'admin@example.com',
                password: hashedPassword
            });
            console.log('Default Admin created: admin@example.com / admin123');
        }
    } catch (err) {
        console.error('Error seeding admin:', err);
    }
};

export const createStaff = async (req: Request, res: Response) => {
    const { name, email, password, department, contact_info } = req.body;
    try {
        // Check uniqueness across tables (optional but good practice)
        const existingStaff = await Staff.findOne({ where: { email } });
        if (existingStaff) return res.status(400).json({ message: 'Email already in use by Staff' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const staff = await Staff.create({
            name,
            email,
            password: hashedPassword,
            department: department || 'General',
            contact_info
        });
        res.status(201).json({ message: 'Staff created successfully', staff });
    } catch (error) {
        res.status(500).json({ message: 'Error creating staff', error });
    }
};

export const deleteStaff = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const staff = await Staff.findByPk(id);
        if (!staff) return res.status(404).json({ message: 'Staff not found' });

        await staff.destroy();
        res.json({ message: 'Staff deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting staff', error });
    }
};
