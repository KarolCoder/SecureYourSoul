# 🔐 Autopass Mobile

A secure, decentralized mobile application for sharing photos and files within families using peer-to-peer technology. Built with React Native, Expo, and Hyperdrive for distributed storage.

## ✨ Features

### 🏠 **Family Vault Creation**

- Create a new secure vault for your family
- Generate unique access keys for family members
- No central servers - your data stays with you

### 🔗 **Easy Connection**

- Join existing family vaults using access keys
- Seamless peer-to-peer connection
- Real-time synchronization across devices

### 📁 **Smart Organization**

- Create and manage folders for different occasions
- Automatic file type detection (images, PDFs)
- Clean, intuitive folder structure

### 📸 **Photo & File Sharing**

- Upload photos directly from camera or gallery
- Support for HEIC/HEIF and standard image formats
- PDF document sharing
- High-quality image preservation

### 🔒 **Privacy & Security**

- End-to-end encryption
- Decentralized storage with Hyperdrive
- No data stored on external servers
- Family-controlled access

### 📱 **Modern Mobile Experience**

- Beautiful, responsive UI with dark theme support
- Custom modal system for Android compatibility
- Smooth animations and transitions
- Optimized for both iOS and Android

## 🏗️ Architecture

### **Frontend**

- **React Native** with Expo Router for navigation
- **Zustand** for state management
- **TypeScript** for type safety
- **Styled Components** for theming

### **Backend**

- **Hyperdrive** for distributed file storage
- **Hyperswarm** for peer-to-peer networking
- **Bare Runtime** for native performance
- **RPC** for client-server communication

### **Key Technologies**

- 🌐 **Peer-to-peer networking** - Direct device connections
- 🗄️ **Distributed storage** - No single point of failure
- 🔐 **End-to-end encryption** - Your data, your control
- 📱 **Cross-platform** - Works on iOS and Android

## 🚀 Getting Started

### For Users

1. **Create a Family Vault**
   - Open the app and tap "Create New Vault"
   - Your vault will be created with a unique access key
   - Share this key with family members

2. **Join a Family Vault**
   - Tap "Connect to Existing Vault"
   - Enter the access key shared by your family
   - Start sharing photos and files instantly

3. **Organize Your Content**
   - Create folders for different events or categories
   - Upload photos from your camera or gallery
   - View and download shared content from family members

### For Developers

Start by installing the dependencies:

```sh
npm install
```

When finished, you can run the app on either iOS or Android.

### iOS

```sh
npm run ios
```

### Android

```sh
npm run android
```

## 📱 Screenshots & Demo

_Coming soon - Screenshots of the app in action_

## 🛠️ Development

### Project Structure

```
app/
├── screens/           # All application screens
├── components/        # Reusable UI components
├── stores/           # Zustand state management
├── contexts/         # React contexts (modals)
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
└── theme/            # App theming and styles

backend/
└── backend.mjs       # Hyperdrive backend server
```

### Key Features Implementation

- **State Management**: Zustand stores for connection, data, and actions
- **Navigation**: Expo Router with file-based routing
- **Styling**: Styled-components with custom theme system
- **File Handling**: Native image picker with HEIC support
- **P2P Communication**: RPC over Hyperdrive for real-time sync
- **Cross-platform**: Custom modal system for Android compatibility

### Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [Hyperdrive](https://github.com/holepunchto/hyperdrive) - Distributed file system
- [Hyperswarm](https://github.com/hyperswarm/hyperswarm) - P2P networking
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Styled Components](https://styled-components.com/) - CSS-in-JS styling

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📄 About

This project demonstrates the power of decentralized, peer-to-peer applications for secure family photo sharing. By using Hyperdrive and Hyperswarm, families can share content directly between devices without relying on centralized cloud services.

**Example of embedding Bare in an Expo application using <https://github.com/holepunchto/react-native-bare-kit>.**

## License

Apache-2.0
