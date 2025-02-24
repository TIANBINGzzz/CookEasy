export const processSSEBuffer = (buffer) => {
    let events = [];
    let delimiterIndex;
    while ((delimiterIndex = buffer.indexOf("\n\n")) !== -1) {
        let eventStr = buffer.slice(0, delimiterIndex).trim();
        buffer = buffer.slice(delimiterIndex + 2);
        const cleanedData = eventStr
            .split("\n")
            .map(line => line.startsWith("data:") ? line.substring(5).trim() : line)
            .join("\n");
        if (cleanedData) {
            events.push(cleanedData);
        }
    }
    return { events, buffer };
}; 