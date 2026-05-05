import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  SignUp: undefined;
  OTPVerification: { mobile: string; name?: string; isSignUp?: boolean };
  ProductDetail: { productId: number };
  Cart: undefined;
  Profile: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

