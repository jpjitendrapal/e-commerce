import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Home: undefined;
  Login: { redirectTo?: keyof RootStackParamList } | undefined;
  SignUp: { redirectTo?: keyof RootStackParamList } | undefined;
  OTPVerification: { mobile: string; name?: string; isSignUp?: boolean; redirectTo?: keyof RootStackParamList };
  ProductDetail: { productId: number };
  Cart: undefined;
  Profile: undefined;
  Checkout: undefined;
  Orders: undefined;
  GQLProducts: undefined;
};

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

