export const formatTimestamp = (date = new Date()) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const validateApiKey = (apiKey) => {
  return apiKey && apiKey.trim().length > 0;
};

export const createMessage = (type, content, timestamp = new Date()) => {
  return {
    type,
    content,
    timestamp: formatTimestamp(timestamp),
    id: Date.now() + Math.random()
  };
};