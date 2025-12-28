
import { sequelize } from './src/config/database';

const checkDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('--- DB CHECK START ---');

        const tables = await sequelize.getQueryInterface().showAllTables();
        console.log('Tables:', tables);

        const [results] = await sequelize.query("DESCRIBE users;");
        const columns = (results as any[]).map(r => r.Field);
        console.log('Users Table Columns:', columns);

        const [staffResults] = await sequelize.query("DESCRIBE staff;");
        const staffColumns = (staffResults as any[]).map(r => r.Field);
        console.log('Staff Table Columns:', staffColumns);

        console.log('--- DB CHECK END ---');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
};

checkDB();
