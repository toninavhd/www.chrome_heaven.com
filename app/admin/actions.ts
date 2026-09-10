'use server';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const envPassword = process.env.ADMIN_PASSWORD;
  
  if (!envPassword) {
    // If not set, deny all to be safe, or allow fallback for local dev?
    // It's safer to deny all unless configured properly.
    console.error('ADMIN_PASSWORD is not set in environment variables!');
    return false;
  }
  
  return password === envPassword;
}
