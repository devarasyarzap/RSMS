const User = require("./User");
const Patient = require("./Patient");
const Doctor = require("./Doctor");
const Polyclinic = require("./Polyclinic");
const Registration = require("./Registration");
const MedicalRecord = require("./MedicalRecord");
const Billing = require("./Billing");
const Medicine = require("./Medicine");
const WardClass = require("./WardClass");
const Bed = require("./Bed");
const InpatientAdmission = require("./InpatientAdmission");

// --- Relasi User & Patient (Fitur Pendaftaran Mandiri) ---
User.hasOne(Patient, { foreignKey: "user_id" });
Patient.belongsTo(User, { foreignKey: "user_id" });

// --- Relasi User & Doctor ---
User.hasOne(Doctor, { foreignKey: "user_id" });
Doctor.belongsTo(User, { foreignKey: "user_id" });

// --- Relasi Dokter & Poli ---
Polyclinic.hasMany(Doctor, { foreignKey: "polyclinic_id" });
Doctor.belongsTo(Polyclinic, { foreignKey: "polyclinic_id" });

// --- Relasi Pendaftaran (Registration) ---
Patient.hasMany(Registration, { foreignKey: "patient_id" });
Registration.belongsTo(Patient, { foreignKey: "patient_id" });

Doctor.hasMany(Registration, { foreignKey: "doctor_id" });
Registration.belongsTo(Doctor, { foreignKey: "doctor_id" });

Polyclinic.hasMany(Registration, { foreignKey: "polyclinic_id" });
Registration.belongsTo(Polyclinic, { foreignKey: "polyclinic_id" });

// --- Relasi Rekam Medis ---
Registration.hasOne(MedicalRecord, { foreignKey: "registration_id" });
MedicalRecord.belongsTo(Registration, { foreignKey: "registration_id" });

// --- Relasi Billing (Kasir) ---
Registration.hasOne(Billing, { foreignKey: "registration_id" });
Billing.belongsTo(Registration, { foreignKey: "registration_id" });

// --- Relasi Rawat Inap (Inpatient) ---
// Kamar & Bed
WardClass.hasMany(Bed, { foreignKey: "ward_class_id" });
Bed.belongsTo(WardClass, { foreignKey: "ward_class_id" });

// Admisi Rawat Inap
Patient.hasMany(InpatientAdmission, { foreignKey: "patient_id" });
InpatientAdmission.belongsTo(Patient, { foreignKey: "patient_id" });

Bed.hasMany(InpatientAdmission, { foreignKey: "bed_id" });
InpatientAdmission.belongsTo(Bed, { foreignKey: "bed_id" });

Doctor.hasMany(InpatientAdmission, { foreignKey: "doctor_id" });
InpatientAdmission.belongsTo(Doctor, { foreignKey: "doctor_id" });

module.exports = {
  User,
  Patient,
  Polyclinic,
  Doctor,
  Registration,
  MedicalRecord,
  Billing,
  Medicine,
  WardClass,
  Bed,
  InpatientAdmission,
};
