const analyticsUrl = new URL("https://analytics-api-lac.vercel.app/collect");

const payload = {
};

fetch(analyticsUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  keepalive: true,
  body: JSON.stringify(payload)
}).catch(() => {});