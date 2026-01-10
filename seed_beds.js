const sequelize = require('./src/config/database');
const { WardClass, Bed } = require('./src/models/associations');

const seed = async () => {
    try {
        await sequelize.authenticate(); // Cek koneksi
        
        // 1. Buat Kelas Kamar
        const vip = await WardClass.create({ class_name: 'VIP', price_per_day: 1000000 });
        const class1 = await WardClass.create({ class_name: 'Kelas 1', price_per_day: 500000 });
        
        console.log('✅ Kelas Kamar Dibuat');

        // 2. Buat Bed / Kasur
        // VIP punya 2 kasur
        await Bed.create({ bed_number: 'VIP-01', status: 'available', ward_class_id: vip.id });
        await Bed.create({ bed_number: 'VIP-02', status: 'available', ward_class_id: vip.id });

        // Kelas 1 punya 3 kasur
        await Bed.create({ bed_number: 'K1-A', status: 'available', ward_class_id: class1.id });
        await Bed.create({ bed_number: 'K1-B', status: 'available', ward_class_id: class1.id });
        await Bed.create({ bed_number: 'K1-C', status: 'maintenance', ward_class_id: class1.id }); // Sedang rusak

        console.log('✅ Data Bed Berhasil Dibuat!');
        process.exit();
    } catch (error) {
        console.error('Gagal seeding:', error);
        process.exit(1);
    }
};

seed();