const { MedicalRecord, Registration, Patient, User, Doctor, Medicine } = require('../models/associations');

// 1. Tambah Obat Baru (Inventory)
exports.addMedicine = async (req, res) => {
    try {
        const { name, stock, price, unit } = req.body;
        const med = await Medicine.create({ name, stock, price, unit });
        res.status(201).json({ message: 'Obat berhasil ditambahkan', data: med });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Lihat Daftar Obat & Stok
exports.getAllMedicines = async (req, res) => {
    try {
        const meds = await Medicine.findAll();
        res.json({ data: meds });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. ambil resep dokter
exports.getPrescriptionQueue = async (req, res) => {
    try {
        // Cari rekam medis yang status farmasinya masih 'pending'
        const queue = await MedicalRecord.findAll({
            where: { pharmacy_status: 'pending' },
            include: [
                {
                    model: Registration,
                    include: [
                        { model: Patient, attributes: ['name'] },
                        { model: Doctor, attributes: ['name'] }  
                    ]
                }
            ]
        });

        // Format data agar mudah dibaca
        const formattedData = queue.map(item => ({
            medical_record_id: item.id,
            patient_name: item.Registration.Patient ? item.Registration.Patient.name : 'Tanpa Nama',
            doctor_name: item.Registration.Doctor ? item.Registration.Doctor.name : 'Tanpa Nama',
            diagnosis: item.diagnosis,
            prescription_text: item.prescription, // Resep dari dokter
            date: item.createdAt
        }));

        res.json({
            message: 'Daftar Antrean Resep',
            data: formattedData
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. PROSES PENGAMBILAN OBAT (Dispense)
exports.dispenseMedicine = async (req, res) => {
    try {
        const { medical_record_id, medicine_id, quantity } = req.body;

        // A. Cek Stok Obat
        const medicine = await Medicine.findByPk(medicine_id);
        if (!medicine) return res.status(404).json({ message: 'Obat tidak ditemukan' });
        
        // Pastikan quantity valid
        if (medicine.stock < quantity) {
            return res.status(400).json({ 
                message: `Stok tidak cukup. Sisa: ${medicine.stock}, Diminta: ${quantity}` 
            });
        }

        // B. Kurangi Stok
        await medicine.update({ stock: medicine.stock - quantity });

        // C. Update Status Resep jadi 'completed' (Selesai)
        // Cek dulu apakah medical_record_id ada
        const record = await MedicalRecord.findByPk(medical_record_id);
        if (record) {
            await record.update({ pharmacy_status: 'completed' });
        }

        res.json({
            message: 'Obat berhasil diserahkan & Stok berkurang',
            sisa_stok: medicine.stock,
            harga_total: medicine.price * quantity
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};