export const TITLE_OPTIONS = [
  { value: 'Mr', label: 'Mr.' },
  { value: 'Ms', label: 'Ms.' },
  { value: 'Mrs', label: 'Mrs.' },
  { value: 'Dr', label: 'Dr.' },
  { value: 'Master', label: 'Master' },
] as const;

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
] as const;

export const COUNTRY_CODE_OPTIONS = [
  { value: '+91', label: '+91' },
  { value: '+968', label: '+968' },
  { value: '+971', label: '+971' },
  { value: '+1', label: '+1' },
] as const;

export const NATIONALITY_OPTIONS = [
  { value: 'Omani', label: 'Omani' },
  { value: 'Emirati', label: 'Emirati' },
  { value: 'Indian', label: 'Indian' },
  { value: 'Saudi', label: 'Saudi' },
  { value: 'American', label: 'American' },
  { value: 'British', label: 'British' },
] as const;

export const MARITAL_STATUS_OPTIONS = [
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Separated', label: 'Separated' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' },
] as const;

export const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'Normal', label: 'Normal' },
  { value: 'HAJ', label: 'HAJ' },
  { value: 'Military', label: 'Military' },
  { value: 'Staff', label: 'Staff' },
  { value: 'UMRAH', label: 'UMRAH' },
  { value: 'VIP', label: 'VIP' },
  { value: 'VVIP', label: 'VVIP' },
] as const;

export const RELIGION_OPTIONS = [
  { value: 'Buddhism', label: 'Buddhism' },
  { value: 'Christianity', label: 'Christianity' },
  { value: 'Hinduism', label: 'Hinduism' },
  { value: 'Islam', label: 'Islam' },
  { value: 'Other', label: 'Other' },
] as const;

export const OCCUPATION_OPTIONS = [
  { value: 'Armed Forces Occupations', label: 'Armed Forces Occupations' },
  { value: 'Clerical Support Workers', label: 'Clerical Support Workers' },
  { value: 'Crafts and Related Trades Workers', label: 'Crafts and Related Trades Workers' },
  { value: 'Elementary Occupations', label: 'Elementary Occupations' },
  { value: 'Managers', label: 'Managers' },
  { value: 'Other', label: 'Other' },
  { value: 'Plant and Machine Operators and Assemblers', label: 'Plant and Machine Operators and Assemblers' },
  { value: 'Professionals', label: 'Professionals' },
  { value: 'Service and Sales Workers', label: 'Service and Sales Workers' },
  { value: 'Skilled Agricultural Forestry and Fishery Workers', label: 'Skilled Agricultural Forestry and Fishery Workers' },
  { value: 'Technicians/Associate Professionals', label: 'Technicians/Associate Professionals' },
  { value: 'Unknown', label: 'Unknown' },
] as const;

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Malayalam', label: 'Malayalam' },
] as const;

export const LIVING_ARRANGEMENT_OPTIONS = [
  { value: 'Alone', label: 'Alone' },
  { value: 'With Family', label: 'With Family' },
  { value: 'Assisted Living', label: 'Assisted Living' },
  { value: 'Other', label: 'Other' },
] as const;

export const PREFERRED_LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Malayalam', label: 'Malayalam' },
] as const;

export const COMMUNICATION_TYPE_OPTIONS = [
  { value: 'Phone', label: 'Phone' },
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'WhatsApp', label: 'WhatsApp' },
  { value: 'Post', label: 'Post' },
] as const;

export const COUNTRY_OPTIONS = [
  { value: 'India', label: 'India' },
  { value: 'Oman', label: 'Oman' },
  { value: 'UAE', label: 'United Arab Emirates' },
  { value: 'Saudi Arabia', label: 'Saudi Arabia' },
  { value: 'USA', label: 'United States' },
  { value: 'UK', label: 'United Kingdom' },
] as const;

export const STATE_OPTIONS_BY_COUNTRY: Record<
  string,
  { value: string; label: string }[]
> = {
  India: [
    { value: 'Andhra Pradesh', label: 'Andhra Pradesh' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Kerala', label: 'Kerala' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Telangana', label: 'Telangana' },
  ],
  Oman: [
    { value: 'Muscat', label: 'Muscat' },
    { value: 'Dhofar', label: 'Dhofar' },
    { value: 'Al Batinah North', label: 'Al Batinah North' },
    { value: 'Al Batinah South', label: 'Al Batinah South' },
  ],
  UAE: [
    { value: 'Abu Dhabi', label: 'Abu Dhabi' },
    { value: 'Dubai', label: 'Dubai' },
    { value: 'Sharjah', label: 'Sharjah' },
    { value: 'Ajman', label: 'Ajman' },
  ],
  'Saudi Arabia': [
    { value: 'Riyadh', label: 'Riyadh' },
    { value: 'Makkah', label: 'Makkah' },
    { value: 'Madinah', label: 'Madinah' },
    { value: 'Eastern Province', label: 'Eastern Province' },
  ],
  USA: [
    { value: 'California', label: 'California' },
    { value: 'New York', label: 'New York' },
    { value: 'Texas', label: 'Texas' },
    { value: 'Florida', label: 'Florida' },
  ],
  UK: [
    { value: 'England', label: 'England' },
    { value: 'Scotland', label: 'Scotland' },
    { value: 'Wales', label: 'Wales' },
    { value: 'Northern Ireland', label: 'Northern Ireland' },
  ],
};

export const CITY_OPTIONS_BY_STATE: Record<
  string,
  { value: string; label: string }[]
> = {
  'Andhra Pradesh': [
    { value: 'Visakhapatnam', label: 'Visakhapatnam' },
    { value: 'Vijayawada', label: 'Vijayawada' },
    { value: 'Guntur', label: 'Guntur' },
  ],
  Karnataka: [
    { value: 'Bengaluru', label: 'Bengaluru' },
    { value: 'Mysuru', label: 'Mysuru' },
    { value: 'Mangaluru', label: 'Mangaluru' },
  ],
  Kerala: [
    { value: 'Kochi', label: 'Kochi' },
    { value: 'Thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'Kozhikode', label: 'Kozhikode' },
  ],
  Maharashtra: [
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Nagpur', label: 'Nagpur' },
  ],
  'Tamil Nadu': [
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Coimbatore', label: 'Coimbatore' },
    { value: 'Madurai', label: 'Madurai' },
  ],
  Telangana: [
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Warangal', label: 'Warangal' },
    { value: 'Nizamabad', label: 'Nizamabad' },
  ],
  Muscat: [
    { value: 'Muscat City', label: 'Muscat City' },
    { value: 'Seeb', label: 'Seeb' },
    { value: 'Bawshar', label: 'Bawshar' },
  ],
  Dhofar: [
    { value: 'Salalah', label: 'Salalah' },
    { value: 'Taqah', label: 'Taqah' },
  ],
  'Al Batinah North': [
    { value: 'Sohar', label: 'Sohar' },
    { value: 'Shinas', label: 'Shinas' },
  ],
  'Al Batinah South': [
    { value: 'Rustaq', label: 'Rustaq' },
    { value: 'Barka', label: 'Barka' },
  ],
  'Abu Dhabi': [
    { value: 'Abu Dhabi City', label: 'Abu Dhabi City' },
    { value: 'Al Ain', label: 'Al Ain' },
  ],
  Dubai: [
    { value: 'Dubai City', label: 'Dubai City' },
    { value: 'Jebel Ali', label: 'Jebel Ali' },
  ],
  Sharjah: [
    { value: 'Sharjah City', label: 'Sharjah City' },
    { value: 'Kalba', label: 'Kalba' },
  ],
  Ajman: [{ value: 'Ajman City', label: 'Ajman City' }],
  Riyadh: [
    { value: 'Riyadh City', label: 'Riyadh City' },
    { value: 'Diriyah', label: 'Diriyah' },
  ],
  Makkah: [
    { value: 'Mecca', label: 'Mecca' },
    { value: 'Jeddah', label: 'Jeddah' },
  ],
  Madinah: [{ value: 'Medina', label: 'Medina' }],
  'Eastern Province': [
    { value: 'Dammam', label: 'Dammam' },
    { value: 'Khobar', label: 'Khobar' },
  ],
  California: [
    { value: 'Los Angeles', label: 'Los Angeles' },
    { value: 'San Francisco', label: 'San Francisco' },
  ],
  'New York': [
    { value: 'New York City', label: 'New York City' },
    { value: 'Buffalo', label: 'Buffalo' },
  ],
  Texas: [
    { value: 'Houston', label: 'Houston' },
    { value: 'Austin', label: 'Austin' },
  ],
  Florida: [
    { value: 'Miami', label: 'Miami' },
    { value: 'Orlando', label: 'Orlando' },
  ],
  England: [
    { value: 'London', label: 'London' },
    { value: 'Manchester', label: 'Manchester' },
  ],
  Scotland: [
    { value: 'Edinburgh', label: 'Edinburgh' },
    { value: 'Glasgow', label: 'Glasgow' },
  ],
  Wales: [{ value: 'Cardiff', label: 'Cardiff' }],
  'Northern Ireland': [{ value: 'Belfast', label: 'Belfast' }],
};

export const IDENTIFYING_DOCUMENT_OPTIONS = [
  { value: 'Passport', label: 'Passport' },
  { value: 'voters ID', label: 'Voters ID' },
  { value: 'Aadhar card', label: 'Aadhar card' }

] as const;

export const INSURANCE_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Bupa Arabia', label: 'Bupa Arabia' },
  { value: 'Tawuniya', label: 'Tawuniya' },
  { value: 'MedGulf', label: 'MedGulf' },
  { value: 'Al Rajhi Takaful', label: 'Al Rajhi Takaful' },
  { value: 'Self Pay', label: 'Self Pay' },
  { value: 'Other', label: 'Other' },
] as const;

export const CORPORATE_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Aramco', label: 'Aramco' },
  { value: 'STC', label: 'STC' },
  { value: 'SABIC', label: 'SABIC' },
  { value: 'Ministry of Health', label: 'Ministry of Health' },
  { value: 'Other', label: 'Other' },
] as const;

export const COMPANY_TYPE_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Private', label: 'Private' },
  { value: 'Government', label: 'Government' },
  { value: 'Semi-Government', label: 'Semi-Government' },
  { value: 'Individual', label: 'Individual' },
] as const;

export const COMPANY_NAME_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'Aramco', label: 'Aramco' },
  { value: 'STC', label: 'STC' },
  { value: 'SABIC', label: 'SABIC' },
  { value: 'Ministry of Health', label: 'Ministry of Health' },
  { value: 'Al Rajhi Bank', label: 'Al Rajhi Bank' },
  { value: 'Other', label: 'Other' },
] as const;

export const PLAN_NAME_OPTIONS = [
  { value: 'Gold Plan', label: 'Gold Plan' },
  { value: 'Silver Plan', label: 'Silver Plan' },
  { value: 'Platinum Plan', label: 'Platinum Plan' },
  { value: 'Basic Plan', label: 'Basic Plan' },
] as const;

export const PRIORITY_OPTIONS = [
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
] as const;

export const INSURANCE_RELATION_OPTIONS = [
  { value: '', label: 'Select' },
  { value: 'AA Cont', label: 'AA Cont' },
  { value: 'Aunt', label: 'Aunt' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Child', label: 'Child' },
  { value: 'Counselor', label: 'Counselor' },
  { value: 'Cousin', label: 'Cousin' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Dentist', label: 'Dentist' },
  { value: 'Emergency contact', label: 'Emergency contact' },
  { value: 'Employer', label: 'Employer' },
  { value: 'Father', label: 'Father' },
  { value: 'Financial Guardian', label: 'Financial Guardian' },
  { value: 'Foster care', label: 'Foster care' },
  { value: 'Foster parent', label: 'Foster parent' },
  { value: 'Fraternal twin', label: 'Fraternal twin' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Granddaughter', label: 'Granddaughter' },
  { value: 'Grandson', label: 'Grandson' },
  { value: 'Grandparent', label: 'Grandparent' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Half-brother', label: 'Half-brother' },
  { value: 'Half-sister', label: 'Half-sister' },
  { value: 'Health care power of attorney', label: 'Health care power of attorney' },
  { value: 'Husband', label: 'Husband' },
  { value: 'Identical twin', label: 'Identical twin' },
  { value: 'Landlord', label: 'Landlord' },
  { value: 'Law Enforcement', label: 'Law Enforcement' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Legal guardian', label: 'Legal guardian' },
  { value: 'Maternal aunt', label: 'Maternal aunt' },
  { value: 'Maternal cousin', label: 'Maternal cousin' },
  { value: 'Maternal Grandfather', label: 'Maternal Grandfather' },
  { value: 'Maternal Grandmother', label: 'Maternal Grandmother' },
  { value: 'Maternal uncle', label: 'Maternal uncle' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Neighbour', label: 'Neighbour' },
  { value: 'Nephew', label: 'Nephew' },
  { value: 'Niece', label: 'Niece' },
  { value: 'Others', label: 'Others' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Parole officer', label: 'Parole officer' },
  { value: 'Paternal aunt', label: 'Paternal aunt' },
  { value: 'Paternal cousin', label: 'Paternal cousin' },
  { value: 'Paternal grandfather', label: 'Paternal grandfather' },
  { value: 'Paternal great grandfather', label: 'Paternal great grandfather' },
  { value: 'Paternal great grandmother', label: 'Paternal great grandmother' },
  { value: 'Paternal uncle', label: 'Paternal uncle' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Psychiatrist', label: 'Psychiatrist' },
  { value: 'Roommate', label: 'Roommate' },
  { value: 'Self', label: 'Self' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Significant other', label: 'Significant other' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Son', label: 'Son' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Stepdaughter', label: 'Stepdaughter' },
  { value: 'Stepfather', label: 'Stepfather' },
  { value: 'Stepmother', label: 'Stepmother' },
  { value: 'Stepson', label: 'Stepson' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Therapist', label: 'Therapist' },
  { value: 'Uncle', label: 'Uncle' },
  { value: 'Ward', label: 'Ward' },
  { value: 'Wife', label: 'Wife' },
] as const;

export const EMERGENCY_TYPE_OPTIONS = [
  { value: 'Emergency Contact', label: 'Emergency Cantact' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Other Contact', label: 'Other Contact' },
] as const;

export const EMERGENCY_RELATION_OPTIONS = [
 { value: '', label: 'Select' },
  { value: 'AA Cont', label: 'AA Cont' },
  { value: 'Aunt', label: 'Aunt' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Child', label: 'Child' },
  { value: 'Counselor', label: 'Counselor' },
  { value: 'Cousin', label: 'Cousin' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Dentist', label: 'Dentist' },
  { value: 'Emergency contact', label: 'Emergency contact' },
  { value: 'Employer', label: 'Employer' },
  { value: 'Father', label: 'Father' },
  { value: 'Financial Guardian', label: 'Financial Guardian' },
  { value: 'Foster care', label: 'Foster care' },
  { value: 'Foster parent', label: 'Foster parent' },
  { value: 'Fraternal twin', label: 'Fraternal twin' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Granddaughter', label: 'Granddaughter' },
  { value: 'Grandson', label: 'Grandson' },
  { value: 'Grandparent', label: 'Grandparent' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Half-brother', label: 'Half-brother' },
  { value: 'Half-sister', label: 'Half-sister' },
  { value: 'Health care power of attorney', label: 'Health care power of attorney' },
  { value: 'Husband', label: 'Husband' },
  { value: 'Identical twin', label: 'Identical twin' },
  { value: 'Landlord', label: 'Landlord' },
  { value: 'Law Enforcement', label: 'Law Enforcement' },
  { value: 'Lawyer', label: 'Lawyer' },
  { value: 'Legal guardian', label: 'Legal guardian' },
  { value: 'Maternal aunt', label: 'Maternal aunt' },
  { value: 'Maternal cousin', label: 'Maternal cousin' },
  { value: 'Maternal Grandfather', label: 'Maternal Grandfather' },
  { value: 'Maternal Grandmother', label: 'Maternal Grandmother' },
  { value: 'Maternal uncle', label: 'Maternal uncle' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Neighbour', label: 'Neighbour' },
  { value: 'Nephew', label: 'Nephew' },
  { value: 'Niece', label: 'Niece' },
  { value: 'Others', label: 'Others' },
  { value: 'Parent', label: 'Parent' },
  { value: 'Parole officer', label: 'Parole officer' },
  { value: 'Paternal aunt', label: 'Paternal aunt' },
  { value: 'Paternal cousin', label: 'Paternal cousin' },
  { value: 'Paternal grandfather', label: 'Paternal grandfather' },
  { value: 'Paternal great grandfather', label: 'Paternal great grandfather' },
  { value: 'Paternal great grandmother', label: 'Paternal great grandmother' },
  { value: 'Paternal uncle', label: 'Paternal uncle' },
  { value: 'Pharmacy', label: 'Pharmacy' },
  { value: 'Psychiatrist', label: 'Psychiatrist' },
  { value: 'Roommate', label: 'Roommate' },
  { value: 'Self', label: 'Self' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Significant other', label: 'Significant other' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Son', label: 'Son' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Stepdaughter', label: 'Stepdaughter' },
  { value: 'Stepfather', label: 'Stepfather' },
  { value: 'Stepmother', label: 'Stepmother' },
  { value: 'Stepson', label: 'Stepson' },
  { value: 'Teacher', label: 'Teacher' },
  { value: 'Therapist', label: 'Therapist' },
  { value: 'Uncle', label: 'Uncle' },
  { value: 'Ward', label: 'Ward' },
  { value: 'Wife', label: 'Wife' },
] as const;

export const DOCUMENT_CATEGORY_OPTIONS = [
  { value: 'EMR', label: 'EMR' },
  { value: 'FO', label: 'FO' },
  { value: 'General', label: 'General' },
  { value: 'Investigation', label: 'Investigation' },
  { value: 'OR', label: 'OR' },
  { value: 'Task', label: 'Task' },
] as const;

export const DOCUMENT_SUB_CATEGORY_BY_CATEGORY: Record<
  string,
  { value: string; label: string }[]
> = {
  'EMR': [
  { value: 'Discharge summaries', label: 'Discharge summaries' },
  { value: 'ECG', label: 'ECG' },
  { value: 'Lab results', label: 'Lab results' },
  { value: 'Other reports', label: 'Other reports' },
  { value: 'Prescription details', label: 'Prescription details' },
  { value: 'Radiology images', label: 'Radiology images' },
  { value: 'Radiology results', label: 'Radiology results' },
  ],
  'FO': [
  { value: 'Approval document', label: 'Approval document' },
  { value: 'General Approval document', label: 'General Approval document' },
  { value: 'General Request document', label: 'General Request document' },
  { value: 'Identifying document', label: 'Identifying document' },
  { value: 'Insurance', label: 'Insurance' },
  { value: 'IP forms', label: 'IP forms' },
  { value: 'Reference letter', label: 'Reference letter' },
  { value: 'Request document', label: 'Request document' },
  ],
  'General': [
    
    { value: 'Other', label: 'Other' },
  ],
  'Investigation': [
    { value: 'Result', label: 'Result' },
   
  ],
  'OR': [
    { value: 'perference Usage item', label: 'perference Usage item' },
   
  ],
  'Task': [{ value: 'Employee task', label: 'Employee task' }],
};
