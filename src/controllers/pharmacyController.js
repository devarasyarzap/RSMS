const Medicine = require('../models/Medicine');
const { Registration, Patient, MedicalRecord } = require('../models/associations');

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

// 3. Proses Resep (Mengurangi Stok)
// Apoteker melihat resep dokter, lalu menginput obat apa saja yang diberikan
exports.dispenseMedicine = async (req, res) => {
    try {
        const { registration_id, medicines } = req.body; 
        // medicines format: [{ "medicine_id": 1, "quantity": 10 }, ...]

        // Cek Registrasi
        const reg = await Registration.findByPk(registration_id);
        if (!reg) return res.status(404).json({ message: 'Registrasi tidak ditemukan' });

        let totalCost = 0;

        // Loop setiap obat yang akan dikeluarkan
        for (const item of medicines) {
            const med = await Medicine.findByPk(item.medicine_id);
            
            if (!med) {
                return res.status(404).json({ message: `Obat ID ${item.medicine_id} tidak ditemukan` });
            }

            if (med.stock < item.quantity) {
                return res.status(400).json({ message: `Stok ${med.name} tidak cukup!` });
            }

            // Kurangi Stok
            med.stock = med.stock - item.quantity;
            await med.save();

            // Hitung harga (untuk keperluan kasir nanti)
            totalCost += med.price * item.quantity;
        }

        // Update status registrasi (Opsional: bisa tambah status 'meds_dispensed')
        // Disini kita biarkan saja, atau simpan total tagihan jika ada tabel billing

        res.json({ 
            message: 'Obat berhasil dikeluarkan & Stok berkurang',
            total_price: totalCost 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};