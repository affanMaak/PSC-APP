---
description: nuclear clean and generate release APK
---

### 🚀 Release Build Workflow

Follow these steps to generate a clean Release APK for your Android app.

#### 1. Nuclear Clean
This command wipes all caches, dependencies, and temporary build files to ensure a fresh environment.
// turbo
```bash
rm -rf node_modules yarn.lock package-lock.json android/app/build && npm install
```

#### 2. Reset Metro Bundler
Start the Metro server with a fresh cache.
// turbo
```bash
npx react-native start --reset-cache
```

#### 3. Gradle Deep Clean
Run this inside the `android` directory to remove stale Gradle files.
// turbo
```bash
cd android && ./gradlew clean && cd ..
```

#### 4. Build Release APK
Generate the final `assembleRelease` APK.
// turbo
```bash
cd android && ./gradlew assembleRelease && cd ..
```

---

### 🛠️ One-Shot "Quick Fix" Chain
If you want to run everything in one go (assuming dependencies are already installed):

```bash
cd android && ./gradlew clean && cd .. && npx react-native start --reset-cache & (sleep 10 && cd android && ./gradlew assembleRelease)
```

> [!NOTE]
> The APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`
