import * as yup from 'yup';

const validationSchema = yup.object().shape({
  employeeId: yup
    .string()
    .required("Employee ID is required")
    .max(100, "Employee ID must be at most 100 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must be at most 20 characters"),
  firstName: yup
    .string()
    .required("First Name is required")
    .max(50, "First Name must be at most 50 characters"),
  lastName: yup
    .string()
    .required("Last Name is required")
    .max(50, "Last Name must be at most 50 characters"),
  emailId: yup
    .string()
    .required("Email is required")
    .email("Invalid email format")
    .max(50, "Email must be at most 50 characters"),
  contactNumber1: yup
    .string()
    .required("Contact Number 1 is required")
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  gender: yup
    .string()
    .required("Gender is required"),
  dateofBirth: yup
    .date()
    .required("Date of Birth is required"),
  joiningDate: yup
    .date()
    .required("Joining Date is required"),
  previousExperience: yup
    .string()
    .required("Previous Experience is required"),
  department: yup
    .string()
    .required("Department is required"),
  designation: yup
    .string()
    .required("Designation is required"),
  previousCtc: yup
    .number()
    .required("Previous CTC is required")
    .positive("Previous CTC must be a positive number"),
  fatherName: yup
    .string()
    .required("Father's Name is required")
    .max(50, "Father's Name must be at most 50 characters"),
  motherName: yup
    .string()
    .required("Mother's Name is required")
    .max(50, "Mother's Name must be at most 50 characters"),
  hno: yup
    .string()
    .required("House Number is required"),
  city: yup
    .string()
    .required("City is required"),
  state: yup
    .string()
    .required("State is required"),
  contactNumber2: yup
    .string()
    .matches(/^\d{10}$/, "Contact number must be exactly 10 digits"),
  aadharNumber: yup
    .string()
    .matches(/^\d{12}$/, "Aadhar number must be exactly 12 digits"),
  panNumber: yup
    .string()
    .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"),
  bankName: yup
    .string()
    .required("Bank Name is required"),
  bankAccount: yup
    .string()
    .required("Bank Account is required"),
  ifscCode: yup
    .string()
    .required("IFSC Code is required"),
  bankBranch: yup
    .string()
    .required("Bank Branch is required"),
  profilePic: yup
    .mixed()
    .required("Profile Picture is required"),
  document1: yup
    .mixed()
    .required("Document 1 is required"),
  document2: yup
    .mixed()
    .required("Document 2 is required"),
  document3: yup
    .mixed()
    .required("Document 3 is required")
});

export default validationSchema;
