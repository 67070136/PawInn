// Future services can use this JSON client without changing page components.
export async function request(path, { method = "GET", body, signal } = {}) {
  const response = await fetch(`/api/${path.replace(/^\//, "")}`, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  const data = response.status === 204 ? null : await response.json();
  if (!response.ok)
    throw new Error(data?.message || "Something went wrong. Please try again.");
  return data;
}
