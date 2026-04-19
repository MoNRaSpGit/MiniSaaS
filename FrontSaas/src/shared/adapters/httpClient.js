export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} on ${url}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
