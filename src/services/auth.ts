// Mock service to simulate sending and verifying OTP

export const authService = {
  sendOTP: async (mobile: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`[Mock] OTP sent to ${mobile}. Assuming OTP is 1234.`);
        resolve(true);
      }, 1000);
    });
  },

  verifyOTP: async (mobile: string, otp: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => {
        // In this mock, '1234' is the universal valid OTP.
        if (otp === '1234') {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 600);
    });
  },
};
