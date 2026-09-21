/**
 * Formats a raw price string professionally with thousands separator commas.
 * Rounds to integer (no decimals).
 * Preserves the existing currency symbol at the beginning.
 * Defaults to Dollars ($) if no symbol is found.
 */
export const formatPrice = (priceStr) => {
    if (!priceStr) return '';
    
    // Remove any extra spacing
    const cleanStr = priceStr.toString().trim();
    
    // Check if it already has a currency symbol at the start (₦, $, €, £, ¥)
    const match = cleanStr.match(/^([₦$€£¥])\s*(.*)$/);
    if (match) {
        const currency = match[1];
        let amountStr = match[2].replace(/,/g, ''); // Remove existing commas to re-format cleanly
        
        // Clean any decimals if they exist
        if (amountStr.includes('.')) {
            amountStr = amountStr.split('.')[0];
        }
        
        // Check if amount is numeric
        if (!isNaN(amountStr) && amountStr.trim() !== '') {
            const num = Math.round(parseFloat(amountStr));
            return `${currency}${num.toLocaleString('en-US')}`;
        }
        return priceStr;
    }
    
    // If it doesn't match the format but is just numeric, default to Dollars and format it
    let amountStr = cleanStr.replace(/,/g, '');
    if (amountStr.includes('.')) {
        amountStr = amountStr.split('.')[0];
    }
    if (!isNaN(amountStr) && amountStr !== '') {
        const num = Math.round(parseFloat(amountStr));
        return `$${num.toLocaleString('en-US')}`;
    }
    
    return priceStr;
};
