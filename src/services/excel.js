import * as XLSX from 'xlsx';

export function parseExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
    });
}

export function mapExcelToPatient(excelData, fieldMapping = defaultFieldMapping) {
    if (!excelData || excelData.length === 0) return null;
    
    const row = excelData[0];
    const patient = {};
    
    Object.entries(fieldMapping).forEach(([excelColumn, patientField]) => {
        if (row[excelColumn] !== undefined) {
            patient[patientField] = row[excelColumn];
        }
    });
    
    return patient;
}

const defaultFieldMapping = {
    'Name': 'name',
    'Patient Name': 'name',
    'National ID': 'national_id',
    'NationalID': 'national_id',
    'Mobile': 'mobile',
    'Phone': 'mobile',
    'Date of Birth': 'date_of_birth',
    'DOB': 'date_of_birth',
    'Governorate': 'governorate',
    'Address': 'address',
    'Problem': 'problem',
    'Symptoms': 'problem',
    'Solution': 'solution',
    'Treatment': 'solution',
    'Price': 'price',
    'Notes': 'notes'
};

export function validatePatientFromExcel(patient) {
    const errors = [];
    
    if (!patient.name) errors.push('Name is required');
    if (!patient.national_id) errors.push('National ID is required');
    if (patient.national_id && !/^\d{14}$/.test(patient.national_id)) {
        errors.push('National ID must be 14 digits');
    }
    if (patient.mobile && !/^\d{11}$/.test(patient.mobile)) {
        errors.push('Mobile must be 11 digits');
    }
    
    return { valid: errors.length === 0, errors };
}