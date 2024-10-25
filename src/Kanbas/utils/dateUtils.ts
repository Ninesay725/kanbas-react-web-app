export const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    // Add 'T00:00:00' if the date string doesn't include time
    const fullDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
    const date = new Date(fullDateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${month} ${day} at ${hours}:${minutes}${ampm}`;
};

export const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    // Add 'T00:00:00' if the date string doesn't include time
    const fullDateString = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
    const date = new Date(fullDateString);
    
    // Use UTC methods to prevent timezone offset
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};
