const { InpatientAdmission, Bed, WardClass, Patient, Doctor } = require('../models/associations');

// 1. Proses Masuk Rawat Inap (Admission)
exports.admitPatient = async (req, res) => {
    try {
        const { patient_id, bed_id, doctor_id, diagnosis } = req.body;

        // Cek Ketersediaan Bed
        const bed = await Bed.findByPk(bed_id);
        if (!bed || bed.status !== 'available') {
            return res.status(400).json({ message: 'Bed tidak ditemukan atau sedang penuh' });
        }

        // Buat Data Admisi
        const admission = await InpatientAdmission.create({
            admission_number: `INP-${Date.now()}`,
            patient_id,
            bed_id,
            doctor_id,
            initial_diagnosis: diagnosis,
            status: 'active'
        });

        // Update Status Bed jadi Terisi
        bed.status = 'occupied';
        await bed.save();

        res.status(201).json({ message: 'Pasien berhasil masuk rawat inap', data: admission });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Proses Pulang (Discharge) & Hitung Biaya Sementara
exports.dischargePatient = async (req, res) => {
    try {
        const { admission_id } = req.body;

        const admission = await InpatientAdmission.findByPk(admission_id, {
            include: [{ model: Bed, include: [WardClass] }] // Ambil data harga kamar
        });

        if (!admission || admission.status === 'discharged') {
            return res.status(400).json({ message: 'Data tidak valid atau pasien sudah pulang' });
        }

        // Set waktu keluar
        const checkOut = new Date();
        admission.check_out_time = checkOut;
        admission.status = 'discharged';
        await admission.save();

        // Update Bed jadi Kosong lagi
        const bed = await Bed.findByPk(admission.bed_id);
        bed.status = 'available';
        await bed.save();

        // HITUNG BIAYA KAMAR (Durasi * Harga)
        const checkIn = new Date(admission.check_in_time);
        // Hitung selisih hari (minimal 1 hari)
        const diffTime = Math.abs(checkOut - checkIn);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        const roomCost = diffDays * admission.Bed.WardClass.price_per_day;

        res.json({ 
            message: 'Pasien dipulangkan', 
            summary: {
                days: diffDays,
                room_price: admission.Bed.WardClass.price_per_day,
                total_room_cost: roomCost
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};