require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const sequelize = require('./src/config/database');

const { User, Patient, Polyclinic, Doctor, Registration, MedicalRecord } = require('./src/models/associations');
const Medicine = require('./src/models/Medicine');
const authRoutes = require('./src/routes/authRoutes');
const patientRoutes = require('./src/routes/patientRoutes');
const masterRoutes = require('./src/routes/masterRoutes'); 
const registrationRoutes = require('./src/routes/registrationRoutes'); 
const doctorRoutes = require('./src/routes/doctorRoutes'); 
const pharmacyRoutes = require('./src/routes/pharmacyRoutes'); 
const authMiddleware = require('./src/middlewares/authMiddleware');
const inpatientRoutes = require('./src/routes/inpatientRoutes');
const billingRoutes = require('./src/routes/billingRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/patients', authMiddleware, patientRoutes);
app.use('/api/registrations', authMiddleware, registrationRoutes);
app.use('/api/doctor', authMiddleware, doctorRoutes);
app.use('/api/pharmacy', authMiddleware, pharmacyRoutes);
app.use('/api/inpatient', authMiddleware, inpatientRoutes);
app.use('/api/billing', authMiddleware, billingRoutes); 

const PORT = process.env.PORT || 3000;


sequelize.sync({ alter: true }) 
    .then(() => {
        console.log('Database & Tables Synced Successfully!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log('Error Database:', err));