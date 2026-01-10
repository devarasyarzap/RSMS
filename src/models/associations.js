const User = require('./User');
const Patient = require('./Patient');
const Polyclinic = require('./Polyclinic');
const Doctor = require('./Doctor');
const Registration = require('./Registration');
const MedicalRecord = require('./MedicalRecord');
const Billing = require('./Billing');
const WardClass = require('./WardClass');
const Bed = require('./Bed');
const InpatientAdmission = require('./InpatientAdmission');
const Medicine = require('./Medicine');

// 1. Relasi User -> Doctor (One-to-One)
User.hasOne(Doctor, { foreignKey: 'user_id' });
Doctor.belongsTo(User, { foreignKey: 'user_id' });

// 2. Relasi Polyclinic -> Doctor (One-to-Many)
// Satu poli punya banyak dokter
Polyclinic.hasMany(Doctor, { foreignKey: 'polyclinic_id' });
Doctor.belongsTo(Polyclinic, { foreignKey: 'polyclinic_id' });

// 3. Relasi Registration (The Big One)
Patient.hasMany(Registration, { foreignKey: 'patient_id' });
Registration.belongsTo(Patient, { foreignKey: 'patient_id' });

Doctor.hasMany(Registration, { foreignKey: 'doctor_id' });
Registration.belongsTo(Doctor, { foreignKey: 'doctor_id' });

Polyclinic.hasMany(Registration, { foreignKey: 'polyclinic_id' });
Registration.belongsTo(Polyclinic, { foreignKey: 'polyclinic_id' });

Registration.hasOne(MedicalRecord, { foreignKey: 'registration_id' });
MedicalRecord.belongsTo(Registration, { foreignKey: 'registration_id' });

Registration.hasOne(Billing, { foreignKey: 'registration_id' });
Billing.belongsTo(Registration, { foreignKey: 'registration_id' });

WardClass.hasMany(Bed, { foreignKey: 'ward_class_id' });
Bed.belongsTo(WardClass, { foreignKey: 'ward_class_id' });

Bed.hasMany(InpatientAdmission, { foreignKey: 'bed_id' });
InpatientAdmission.belongsTo(Bed, { foreignKey: 'bed_id' });

Doctor.hasMany(InpatientAdmission, { foreignKey: 'doctor_id' });
InpatientAdmission.belongsTo(Doctor, { foreignKey: 'doctor_id' });

module.exports = { 
    User, Patient, Polyclinic, Doctor, Registration, 
    MedicalRecord, Billing, Medicine,
    WardClass, Bed, InpatientAdmission
};