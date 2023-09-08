# Playing Bad Apple in CLI with Node.js and OpenCV

This repository provides a way to play Bad Apple in the command line interface (CLI) using Node.js and OpenCV. Before getting started, make sure you have Node.js version 16.17.0 or higher installed.

### Installation and Usage Instructions
1. Install dependencies using npm:
  ```bash
  npm install
  ```

2. Install CMake, which is required for building OpenCV:
  You can download and install CMake from the official [CMake website](https://cmake.org/download/).

3. Install OpenCV using Chocolatey (a package manager for Windows):
  ```bash
  choco install OpenCV
  ```
  If you're using a different operating system, install OpenCV according to the instructions for your system.

4. Build OpenCV using the following command:
  ```bash
  npm run build-opencv
  ```

5. Build OpenCV using the following command:
  ```bash
  npm run build-opencv
  ```
  If you encounter any issues during the OpenCV build process, please follow the instructions for building OpenCV from [opencv4nodejs](https://github.com/UrielCh/opencv4nodejs) to troubleshoot and resolve them.

6. Run the script:
  ```bash
  npm run start
  ```

### Dependencies
- Node.js version 16.17.0 and above.
- Microsoft Visual C++.
- CMake.
- OpenCV.

