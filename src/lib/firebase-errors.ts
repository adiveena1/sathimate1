
export function getFirebaseAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please check your email and password.';
    case 'auth/email-already-in-use':
      return 'This email address is already in use by another account.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please enable it in the Firebase Console.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.';
    // Google / Popup sign-in errors
    case 'auth/popup-blocked':
      return 'The sign-in popup was blocked by your browser. Please allow popups for this site and try again.';
    case 'auth/popup-closed-by-user':
      return 'The sign-in popup was closed before completing. Please try again.';
    case 'auth/cancelled-popup-request':
      return 'Only one sign-in popup can be open at a time. Please try again.';
    case 'auth/unauthorized-domain':
      return 'This domain is not authorized for sign-in. Please add it to the Authorized Domains in the Firebase Console (Authentication → Settings).';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method. Try logging in with that method instead.';
    case 'auth/credential-already-in-use':
      return 'This credential is already linked to a different account.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Please check your internet connection and try again.';
    case 'auth/internal-error':
      return 'An internal authentication error occurred. Please try again later.';
    default:
      // Show the raw error code to help with debugging
      console.error('[Auth Error] Unhandled error code:', errorCode);
      return `Authentication error (${errorCode}). Please try again.`;
  }
}
