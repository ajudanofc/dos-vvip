# DOS-VVIP
![Preview](https://files.catbox.moe/57g44n.jpg)
## Overview
DOS-VVIP is a **Node.js-based terminal application** designed to simulate high-volume **HTTP/HTTPS GET traffic** toward a specified target for educational and testing purposes in controlled environments.  
The tool supports parallel requests, randomized headers, and real-time monitoring of request outcomes.

> ⚠️ **Legal Disclaimer**  
> This tool is intended **for educational use and testing on systems you own or have explicit permission to test**.  
> Any misuse against third-party systems without authorization may be illegal and is strictly discouraged.  
> The author takes no responsibility for improper use.

---

## Features
- HTTP & HTTPS support
- Parallel request execution (multi-thread)
- Randomized User-Agent headers
- Dynamic query string generation (cache bypass)
- Real-time statistics (success, failure, error reasons)
- Time-based execution with automatic stop
- Interactive terminal interface

---

## Requirements
- Node.js v18 or higher
- npm
- Linux or Termux (Android)

---

## Installation

### Termux (Android)
```bash
pkg update && pkg upgrade
pkg install nodejs git -y
git clone https://github.com/ajudanofc/dos-vvip.git
cd dos-vvip
npm install
npm start
```
### Linux
```bash
sudo apt update
sudo apt install nodejs npm git -y
git clone https://github.com/ajudanofc/dos-vvip.git
cd dos-vvip
npm install
npm start
```
---

## License

Educational Use Only
Free to use for learning and experimentation.

---
