---
description: fix CMake and C++ Codegen errors
---

### 🚀 C++ Codegen Repair Workflow

If your build is failing with "CMake Error: add_subdirectory given source ... codegen/jni which is not an existing directory", follow these steps.

#### 1. Purge C++ Caches
Delete the broken CMake build state.
// turbo
```bash
rm -rf android/app/.cxx
```

#### 2. Force Codegen Generation
Force React Native to regenerate the missing JNI and C++ bridge files.
// turbo
```bash
cd android && ./gradlew generateCodegenArtifactsAndroid && cd ..
```

#### 3. Build Without Clean (Bypass the Loop)
Compile the Release APK while explicitly skipping the task that is failing in the clean loop.
// turbo
```bash
cd android && ./gradlew assembleRelease -x externalNativeBuildClean && cd ..
```

---

### 🛠️ The "God-Level" Repair Chain
Run this single command to fix the state and build the APK in one go:

```bash
rm -rf android/app/.cxx && cd android && ./gradlew generateCodegenArtifactsAndroid && ./gradlew assembleRelease -x externalNativeBuildClean && cd ..
```

> [!IMPORTANT]
> This workflow ensures that the `codegen` directory is physically created before CMake tries to reference it, and prevents Gradle from deleting it immediately via `externalNativeBuildClean`.
