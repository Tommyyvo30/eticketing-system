const fetchWithAuth = (url, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);

  return fetch(url, { ...options, headers });
};

export default fetchWithAuth;
