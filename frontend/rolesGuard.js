function rolesGuard(requiredRole) {
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/';
    return;
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.role !== requiredRole) {
      window.location.href = '/';
    }
  } catch (e) {
    window.location.href = '/';
  }
}

if (typeof module !== 'undefined') {
  module.exports = { rolesGuard };
}
