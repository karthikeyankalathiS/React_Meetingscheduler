export const validateDateTime = (startTime, endTime, setError) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (end <= start) {
      setError("End time should be after start time.");
      return false;
    }
    const diffInHours = (end - start) / (1000 * 60 * 60);
    if (diffInHours > 30) {
      setError("Meeting can't be more than 30 hours.");
      return false;
    }
    return true;
};