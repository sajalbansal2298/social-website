export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const base = 4;
  const padding = '='.repeat((base - (base64String.length % base)) % base);
  // eslint-disable-next-line no-useless-escape
  const base64 = (base64String + padding).replace(/\\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Validate Email
export function validateEmail(email: string): void {
  const re = /\S+@\S+\.\S+/;

  if (!re.test(email)) {
    throw new Error('Invalid Email');
  }
}

// Validate Password
export function validatePassword(pwd: string): void {
  const re = /^(?=.*[A-Z])(?=.*\d)[^\s\\]{8,}$/;

  if (!re.test(pwd)) {
    throw new Error('Invalid Password');
  }
}
