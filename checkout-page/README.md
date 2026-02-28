# React + Vite

This project uses **React** with **Vite** to provide a fast, lightweight, and modern development setup with **Hot Module Replacement (HMR)** and a basic **ESLint** configuration.

Vite enables faster builds and instant reloads, making the development experience smooth and efficient.

## Plugins Used

Currently, two official React plugins are supported in Vite:

### @vitejs/plugin-react
- Uses **Babel** for Fast Refresh and JSX transformation  
- Best choice for stable and widely-used tooling

### @vitejs/plugin-react-swc
- Uses **SWC**, which is faster than Babel  
- Recommended for better performance in larger projects

You can choose either plugin based on your project requirements.

## React Compiler

The React Compiler is not enabled by default in this template, as it may impact development and build performance.

If you want to enable it, refer to the official React documentation:  
👉 https://react.dev/learn/react-compiler/installation

## ESLint Configuration

This template includes a basic ESLint setup to help catch common issues and maintain clean code.

For production-level applications, it is recommended to:
- Use **TypeScript**
- Enable **type-aware ESLint rules**
- Improve code safety and maintainability

You can refer to the official React + Vite TypeScript template here:  
👉 https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts

It also explains how to configure **typescript-eslint** properly.

## Summary

- Fast development using Vite  
- Hot Module Replacement enabled  
- ESLint for cleaner code  
- Easy to scale for production applications  

This setup is suitable for learning React as well as building real-world applications.
