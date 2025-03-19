import { typeAuth } from "../type/typeAuth";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  logged: boolean;
  user: User | null;
}

type AuthAction =
  | { type: typeof typeAuth.login; payload: User }
  | { type: typeof typeAuth.logout };

export const authReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case typeAuth.login:
      return {
        ...state,
        logged: true,
        user: action.payload,
      };

    case typeAuth.logout:
      return {
        ...state,
        logged: false,
        user: null,
      };

    default:
      return state;
  }
};
