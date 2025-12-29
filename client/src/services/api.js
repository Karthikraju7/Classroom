import config from "../config";

async function apiFetch(
  url,
  { method = "GET", body, headers = {}, isMultipart = false } = {}
) {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    ...(isMultipart ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const response = await fetch(`${config.API_BASE_URL}${url}`, {
    method,
    headers: finalHeaders,
    body: body
      ? isMultipart
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (!response.ok) {
    let errorMessage = "Something went wrong";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      const text = await response.text();
      errorMessage = text || errorMessage;
    }

    throw new Error(errorMessage);
  }

  // For file streams (PDFs, downloads)
  const contentType = response.headers.get("Content-Type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response;
}

export default apiFetch;
