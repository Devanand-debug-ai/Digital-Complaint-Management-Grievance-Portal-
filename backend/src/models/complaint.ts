import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user';

export class Complaint extends Model {
    public id!: number;
    public title!: string;
    public description!: string;
    public category!: string;
    public status!: 'Open' | 'Assigned' | 'In-progress' | 'Resolved';
    public attachments!: string;
    public userId!: number;
    public staffId!: number;
    public feedback!: string;
    public feedbackRating!: number;
    public feedbackDate!: Date;
    public resolutionNotes!: string;
}

Complaint.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('Open', 'Assigned', 'In-progress', 'Resolved'),
            defaultValue: 'Open',
        },
        attachments: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        feedback: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        feedbackRating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
                max: 5
            }
        },
        feedbackDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resolutionNotes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'complaints',
    }
);

// Relationships
import { Staff } from './staff';

// Relationships
User.hasMany(Complaint, { foreignKey: 'userId', as: 'complaints' });
Complaint.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Staff.hasMany(Complaint, { foreignKey: 'staffId', as: 'assignedComplaints' });
Complaint.belongsTo(Staff, { foreignKey: 'staffId', as: 'staff' });
