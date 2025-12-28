import { User } from './user';
import { Staff } from './staff';
import { Admin } from './admin';
import { Complaint } from './complaint';
import { sequelize } from '../config/database';
import { seedAdmin } from '../controllers/authController';

const syncDB = async () => {
    try {
        // Use alter: true to update tables without dropping them (preserves data)
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

        // Seed initial admin
        await seedAdmin();
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

export { User, Staff, Admin, Complaint, syncDB };
