# AI Context & Guidelines (Gemini)

This project is a generic, highly-configurable React Native (Expo) e-commerce application. It is designed to be easily adaptable for multiple clients by changing the environment variables.

## Key Principles
1. **Generic Codebase**: Components and features should be reusable and generic. Avoid client-specific logic or hardcoded text.
2. **Environment Variables**: Use `src/config/env.ts` to access typed `.env` variables for any configuration (API URLs, keys, theme colors, etc.).
3. **Cross-Platform**: The application is built with Expo. Ensure components work nicely across Android, iOS, and Web.
4. **State Management**: Zustand is the standard for global state management. Keep stores modular.
5. **Types**: Use TypeScript strictly. Avoid `any` types. Define clear interfaces for all models and props.
6. **Authentication**: Uses a mobile number + OTP based flow.
7. **Responsive Design**: Ensure that all components, layouts, and screens are responsive and adapt flawlessly to different screen sizes and orientations across mobile and web.

Always refer to these principles when adding new features or making architectural decisions.
