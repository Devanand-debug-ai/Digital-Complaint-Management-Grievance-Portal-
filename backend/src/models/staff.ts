import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Staff extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public contact_info!: string;
    public department!: string;
    // Helper for auth logic to treat this as 'role'
    public readonly role = 'Staff';
}

Staff.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact_info: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'General'
        }
    },
    {
        sequelize,
        tableName: 'staff',
    }
);
