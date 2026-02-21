const { URL } = require('url');
const net = require('net');

function isPrivateIpAddress(ip) {
  if (ip.startsWith('10.') || ip.startsWith('127.') || ip.startsWith('192.168.')) {
    return true;
  }

  if (ip.startsWith('172.')) {
    const second = Number(ip.split('.')[1]);
    return second >= 16 && second <= 31;
  }

  if (ip === '::1' || ip.startsWith('fc') || ip.startsWith('fd') || ip.startsWith('fe80')) {
    return true;
  }

  return false;
}

function isSafeExternalUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;

    const hostname = parsed.hostname.toLowerCase();
    if (hostname === 'localhost' || hostname.endsWith('.local')) return false;

    if (net.isIP(hostname) && isPrivateIpAddress(hostname)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function normalizeUrl(rawUrl) {
  const parsed = new URL(rawUrl);
  parsed.hash = '';
  const normalized = parsed.toString();
  return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized;
}

module.exports = {
  isSafeExternalUrl,
  normalizeUrl
};
