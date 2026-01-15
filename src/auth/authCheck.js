// utils/authCheck.js
import { getUserData } from '../../config/apis';

export const checkAuthStatus = async (navigation) => {
  try {
    const userData = await getUserData();
    if (userData) {
      console.log('✅ User already logged in:', userData);
      // You can automatically navigate to home if user is logged in
      return userData;
    }
    return null;
  } catch (error) {
    console.error('Error checking auth status:', error);
    return null;
  }
};