const { Billing, Registration, Patient, Doctor } = require('../models/associations');

// 1. Generate Tagihan (Hitung Total)
exports.generateBill = async (req, res) => {
    try {
        const { registration_id, medicine_cost } = req.body;
        const DOCTOR_FEE = 50000;
        const ADMIN_FEE = 5000;

        // Cek apakah sudah ada tagihan sebelumnya?
        let bill = await Billing.findOne({ where: { registration_id } });

        const total = parseInt(medicine_cost) + parseInt(room_cost || 0) + DOCTOR_FEE + ADMIN_FEE;

        if (bill) {
            // Update jika sudah ada
            bill.total_amount = total;
            await bill.save();
        } else {
            // Buat baru jika belum ada
            bill = await Billing.create({
                registration_id,
                invoice_number: `INV-${Date.now()}`,
                total_amount: total,
                payment_status: 'pending'
            });
        }

        res.json({ 
            message: 'Tagihan dibuat', 
            data: {
                ...bill.toJSON(),
                details: {
                    doctor_fee: DOCTOR_FEE,
                    admin_fee: ADMIN_FEE,
                    medicine_cost: parseInt(medicine_cost)
                }
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Proses Pembayaran (Bayar Lunas)
exports.payBill = async (req, res) => {
    try {
        const { invoice_number, payment_method } = req.body;

        const bill = await Billing.findOne({ 
            where: { invoice_number },
            include: [{ model: Registration }]
        });

        if (!bill) return res.status(404).json({ message: 'Invoice tidak ditemukan' });

        // Update Billing
        bill.payment_status = 'paid';
        bill.payment_method = payment_method;
        await bill.save();

        res.json({ message: 'Pembayaran Berhasil! Transaksi Selesai.', data: bill });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};