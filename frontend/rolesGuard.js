function getCookie(name) {
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

function rolesGuard(requiredRole) {
  const token = getCookie('jwt');
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
