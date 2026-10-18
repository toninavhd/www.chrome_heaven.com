// Admin client authentication helper with SHA-256 cryptographic hashing
// No secrets or plaintext passwords are exposed.

const DEFAULT_HASH = '43f4fa64987f053b907fa3cad12b2346e1f37a337c22eff5d6ab8be5441cabb1';
const SALT = 'ch95_heaven_vault_salt_';

export async function hashPassword(input: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return '';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(SALT + input);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  
  const computedHash = await hashPassword(password);
  if (!computedHash) return false;

  // Check if user set a custom password hash in localStorage
  if (typeof window !== 'undefined') {
    const customHash = localStorage.getItem('ch_admin_custom_hash');
    if (customHash) {
      return computedHash === customHash;
    }
  }

  // Fallback to initial master hash
  return computedHash === DEFAULT_HASH;
}

export async function setCustomAdminPassword(newPassword: string): Promise<boolean> {
  if (typeof window === 'undefined' || !newPassword || newPassword.length < 4) {
    return false;
  }
  const computedHash = await hashPassword(newPassword);
  if (!computedHash) return false;
  
  localStorage.setItem('ch_admin_custom_hash', computedHash);
  return true;
}

export function resetCustomAdminPassword(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('ch_admin_custom_hash');
  }
}

