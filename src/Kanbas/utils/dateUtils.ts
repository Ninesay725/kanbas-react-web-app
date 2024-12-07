export function formatDateForInput(date: string | undefined): string {
    if (!date) return "";
    const d = new Date(date);
    // Adjust for local timezone
    const tzOffset = d.getTimezoneOffset() * 60000; // offset in milliseconds
    const localDate = new Date(d.getTime() - tzOffset);
    return localDate.toISOString().slice(0, 16);
}

export function formatDate(dateString: string | undefined) {
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
}
