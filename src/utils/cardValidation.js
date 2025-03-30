// src/utils/cardValidation.js
// Simple credit card validation utility

/**
 * Validates a credit card number (basic validation)
 * @param {string} cardNumber - The credit card number to validate
 * @returns {boolean} - Whether the card number is valid
 */
export const validateCardNumber = (cardNumber) => {
    // Remove spaces and non-digit characters
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    // Check if it's empty or not the right length (most cards are 13-19 digits)
    if (!digitsOnly || digitsOnly.length < 13 || digitsOnly.length > 19) {
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates expiry date in MM/YY format
   * @param {string} expiryDate - The expiry date in MM/YY format
   * @returns {boolean} - Whether the expiry date is valid
   */
  export const validateExpiryDate = (expiryDate) => {
    // Check format
    if (!expiryDate || !expiryDate.includes('/')) {
      return false;
    }
    
    const [monthStr, yearStr] = expiryDate.split('/');
    
    if (!monthStr || !yearStr || monthStr.length !== 2 || yearStr.length !== 2) {
      return false;
    }
    
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10) + 2000; // Convert YY to 20YY
    
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return false;
    }
    
    // Check if card is expired
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JS months are 0-indexed
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates CVV code
   * @param {string} cvv - The CVV code
   * @returns {boolean} - Whether the CVV is valid
   */
  export const validateCVV = (cvv) => {
    // Remove non-digits
    const digitsOnly = cvv.replace(/\D/g, '');
    
    // Check length (3-4 digits)
    return digitsOnly.length >= 3 && digitsOnly.length <= 4;
  };
  
  /**
   * Formats a credit card number with spaces
   * @param {string} cardNumber - The credit card number to format
   * @returns {string} - The formatted card number
   */
  export const formatCardNumber = (cardNumber) => {
    // Remove existing spaces and non-digits
    const digitsOnly = cardNumber.replace(/\D/g, '');
    let formatted = '';
    
    // Add a space after every 4 digits
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digitsOnly[i];
    }
    
    return formatted;
  };
  
  /**
   * Validates all payment form fields
   * @param {Object} paymentInfo - Payment information object
   * @returns {Object} - Validation result with errors
   */
  export const validatePaymentForm = (paymentInfo) => {
    const { cardNumber, expiryDate, cvv, cardholderName } = paymentInfo;
    
    const errors = {};
    
    if (!validateCardNumber(cardNumber)) {
      errors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!validateExpiryDate(expiryDate)) {
      errors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!validateCVV(cvv)) {
      errors.cvv = 'CVV should be 3 or 4 digits';
    }
    
    if (!cardholderName || cardholderName.trim().length < 3) {
      errors.cardholderName = 'Please enter the cardholder name';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };