
const bcrypt = require('bcryptjs');
const { createUser } = require('./src/models/userModel');

async function createAdmin() {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        const user = await createUser('Admin', 'admin@respondr.io', hashedPassword, 'admin', 'medical');
        console.log('Admin created:', user);
        process.exit(0);
    } catch (err) {
        console.error('Failed to create admin:', err);
        process.exit(1);
    }
}

createAdmin();
