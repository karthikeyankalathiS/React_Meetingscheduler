export const setMinDateTime = (setStartTime, setEndTime) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const dateTime = `${year}-${month}-${day}T${hour}:${minute}`;
    setStartTime(dateTime);
    setEndTime(dateTime);
};