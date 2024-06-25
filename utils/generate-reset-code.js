// Generate a unique 6-digit code
function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export default generateResetCode;
