import { Request, Response } from 'express';
import { Complaint } from '../models/complaint';
import { User, Staff, Admin } from '../models'; // Import from central index
import { AuthRequest } from '../middleware/authMiddleware';
import { Op } from 'sequelize';

export const createComplaint = async (req: AuthRequest, res: Response) => {
    const { title, description, category, attachments } = req.body;
    const userId = req.user.id;

    try {
        const complaint = await Complaint.create({
            title,
            description,
            category,
            attachments,
            userId,
            status: 'Open',
        });
        res.status(201).json({ message: 'Complaint submitted successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error creating complaint', error });
    }
};

export const getComplaints = async (req: AuthRequest, res: Response) => {
    const { role, id } = req.user;

    try {
        let complaints;
        if (role === 'User') {
            complaints = await Complaint.findAll({
                where: { userId: id },
                include: [{ model: Staff, as: 'staff', attributes: ['name'] }]
            });
        } else if (role === 'Staff') {
            complaints = await Complaint.findAll({
                where: { staffId: id },
                include: [{ model: User, as: 'user', attributes: ['name'] }]
            });
        } else {
            // Admin sees all
            complaints = await Complaint.findAll({
                include: [
                    { model: User, as: 'user', attributes: ['name'] },
                    { model: Staff, as: 'staff', attributes: ['name'] }
                ]
            });
        }
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching complaints', error });
    }
};

export const updateStatus = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { status, staffId, resolutionNotes } = req.body;
    const { role } = req.user;

    try {
        const complaint = await Complaint.findByPk(id);
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (role === 'User') {
            return res.status(403).json({ message: 'Users cannot update status' });
        }

        if (status) complaint.status = status;

        // Save Resolution Notes if provided and status is Resolved
        if (status === 'Resolved' && resolutionNotes) {
            complaint.resolutionNotes = resolutionNotes;
        }

        // Assign to Staff ID
        if (staffId && role === 'Admin') {
            // Check if staff is already busy with another active complaint
            const activeComplaint = await Complaint.findOne({
                where: {
                    staffId: staffId,
                    status: { [Op.not]: 'Resolved' },
                    id: { [Op.not]: id } // Exclude current complaint if re-assigning
                }
            });

            if (activeComplaint) {
                return res.status(400).json({ message: 'Selected staff is currently working on another task' });
            }

            complaint.staffId = staffId;
        }

        await complaint.save();
        res.json({ message: 'Complaint updated', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error updating complaint', error });
    }
};

export const submitFeedback = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { feedback, rating } = req.body;
    const userId = req.user.id;

    try {
        const complaint = await Complaint.findByPk(id);

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // Verify the user owns this complaint
        if (complaint.userId !== userId) {
            return res.status(403).json({ message: 'You can only provide feedback on your own complaints' });
        }

        // Verify the complaint is resolved
        if (complaint.status !== 'Resolved') {
            return res.status(400).json({ message: 'Feedback can only be submitted for resolved complaints' });
        }

        // Check if feedback already exists
        if (complaint.feedback) {
            return res.status(400).json({ message: 'Feedback has already been submitted for this complaint' });
        }

        complaint.feedback = feedback;
        complaint.feedbackRating = rating;
        complaint.feedbackDate = new Date();

        await complaint.save();
        res.json({ message: 'Feedback submitted successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting feedback', error });
    }
};

export const getAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const totalComplaints = await Complaint.count();
        const openComplaints = await Complaint.count({ where: { status: 'Open' } });
        const assignedComplaints = await Complaint.count({ where: { status: 'Assigned' } });
        const inProgressComplaints = await Complaint.count({ where: { status: 'In-progress' } });
        const resolvedComplaints = await Complaint.count({ where: { status: 'Resolved' } });

        // Total users (User table only contains Users now)
        const totalUsers = await User.count();
        const totalStaff = await Staff.count();
        const totalAdmins = await Admin.count();

        // Feedback stats
        const feedbackCount = await Complaint.count({ where: { feedbackRating: { [Op.ne]: null } } });
        const avgRating = await Complaint.findAll({
            attributes: [[Complaint.sequelize!.fn('AVG', Complaint.sequelize!.col('feedbackRating')), 'avgRating']],
            where: { feedbackRating: { [Op.ne]: null } },
            raw: true
        });

        res.json({
            complaints: {
                total: totalComplaints,
                open: openComplaints,
                assigned: assignedComplaints,
                inProgress: inProgressComplaints,
                resolved: resolvedComplaints
            },
            users: {
                total: totalUsers, // Show ONLY regular users count
                staff: totalStaff,
                admins: totalAdmins
            },
            feedback: {
                total: feedbackCount,
                averageRating: (avgRating[0] as any)?.avgRating || 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analytics', error });
    }
};
