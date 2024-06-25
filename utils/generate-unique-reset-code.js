import { PasswordReset } from '../models';

// Generate a unique 6-digit code
async function generateUniqueResetCode() {
  let code;
  let existingCode;
  do {
    code = Math.floor(100000 + Math.random() * 900000);
    existingCode = await PasswordReset.findOne({ code }).lean();
  } while (existingCode);
  return code;
}

export default generateUniqueResetCode;
