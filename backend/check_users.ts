
import { sequelize } from './src/config/database';
import { Admin, Staff } from './src/models';

const checkUsers = async () => {
    try {
        await sequelize.authenticate();
        console.log('--- USER CHECK START ---');

        const admins = await Admin.findAll();
        console.log('Admins found:', admins.map(a => ({ id: a.id, email: a.email, password: a.password.substring(0, 10) + '...' })));

        const staff = await Staff.findAll();
        console.log('Staff found:', staff.map(s => ({ id: s.id, email: s.email })));

        console.log('--- USER CHECK END ---');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkUsers();
