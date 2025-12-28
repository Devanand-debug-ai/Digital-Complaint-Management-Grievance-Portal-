import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class Admin extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    // Helper for auth logic
    public readonly role = 'Admin';
}

Admin.init(
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
        }
    },
    {
        sequelize,
        tableName: 'admins',
    }
);
