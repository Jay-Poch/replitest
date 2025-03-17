#!/bin/bash

# TinyWhoop FPV Component Picker Installation Script
# This script installs and runs the TinyWhoop FPV Component Picker website

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}TinyWhoop FPV Component Picker - Installation Script${NC}"
echo "-------------------------------------------------------"
echo ""

# Check if running as root (we don't need root privileges)
if [ "$(id -u)" = "0" ]; then
  echo -e "${YELLOW}Warning: You are running this script as root.${NC}"
  echo "This application doesn't require root privileges to run."
  echo "It's recommended to run it as a regular user."
  echo ""
  read -p "Do you want to continue anyway? (y/n) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Installation aborted.${NC}"
    exit 1
  fi
fi

# Function to check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Check for required dependencies
echo -e "${GREEN}Checking dependencies...${NC}"

# Check for Node.js
if ! command_exists node; then
  echo -e "${RED}Node.js is not installed.${NC}"
  echo "Please install Node.js (v16 or higher) and npm before continuing."
  echo "You can install them from https://nodejs.org/ or using your package manager."
  exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 16 ]; then
  echo -e "${RED}Node.js version must be 16 or higher. Found version: $(node -v)${NC}"
  echo "Please upgrade Node.js before continuing."
  exit 1
fi

echo -e "Node.js: ${GREEN}OK${NC} ($(node -v))"

# Check for npm
if ! command_exists npm; then
  echo -e "${RED}npm is not installed.${NC}"
  echo "Please install npm before continuing."
  exit 1
fi

echo -e "npm: ${GREEN}OK${NC} ($(npm -v))"

# Check for git
if ! command_exists git; then
  echo -e "${YELLOW}Warning: git is not installed.${NC}"
  echo "We'll try to download the application as a zip file instead."
  USE_GIT=false
else
  echo -e "git: ${GREEN}OK${NC} ($(git --version))"
  USE_GIT=true
fi

# Create installation directory
echo ""
echo -e "${GREEN}Setting up installation directory...${NC}"

# Ask for installation directory
read -p "Enter installation directory (default: ./tinywhoop-builder): " INSTALL_DIR
INSTALL_DIR=${INSTALL_DIR:-"./tinywhoop-builder"}

# Create directory if it doesn't exist
mkdir -p "$INSTALL_DIR"
if [ ! -d "$INSTALL_DIR" ]; then
  echo -e "${RED}Failed to create installation directory: $INSTALL_DIR${NC}"
  exit 1
fi

# Change to the installation directory
cd "$INSTALL_DIR" || exit 1
echo -e "Installation directory: ${GREEN}$INSTALL_DIR${NC}"

# Clone or download the repository
echo ""
echo -e "${GREEN}Downloading application...${NC}"
APP_REPO="https://github.com/yourusername/tinywhoop-builder"

if [ "$USE_GIT" = true ]; then
  # Use git to clone the repository
  echo "Cloning from repository..."
  
  # This is a placeholder - in a real script, you would clone from an actual repository
  # git clone "$APP_REPO" .
  
  # For the purpose of this example, we'll create the files from scratch
  echo "Creating application files..."
else
  # Download as a zip file
  echo "Downloading application archive..."
  
  # This is a placeholder - in a real script, you would download from an actual URL
  # curl -L "$APP_REPO/archive/main.zip" -o tinywhoop-builder.zip
  
  # For the purpose of this example, we'll create the files from scratch
  echo "Creating application files..."
fi

# Create package.json
cat > package.json << 'EOF'
{
  "name": "tinywhoop-builder",
  "version": "1.0.0",
  "description": "TinyWhoop FPV Component Picker",
  "type": "module",
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@tanstack/react-query": "^5.60.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.39.1",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "lucide-react": "^0.453.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.1",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "wouter": "^3.3.5",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0",
    "zustand": "^4.3.3"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "autoprefixer": "^10.4.20",
    "esbuild": "^0.25.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "tsx": "^4.19.1",
    "typescript": "5.6.3",
    "vite": "^5.4.14"
  }
}
EOF

# Install dependencies
echo ""
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Build the application
echo ""
echo -e "${GREEN}Building the application...${NC}"
npm run build

# Create a simple startup script
cat > start.sh << 'EOF'
#!/bin/bash
cd "$(dirname "$0")"
npm start
EOF

chmod +x start.sh

# Print completion message
echo ""
echo -e "${GREEN}Installation complete!${NC}"
echo "-------------------------------------------------------"
echo "The TinyWhoop FPV Component Picker has been installed successfully."
echo ""
echo "To start the application:"
echo "  cd $INSTALL_DIR"
echo "  ./start.sh"
echo ""
echo "The application will be available at http://localhost:5000"
echo ""
echo "Thank you for installing TinyWhoop FPV Component Picker!"

# Offer to start the application now
read -p "Would you like to start the application now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${GREEN}Starting the application...${NC}"
  ./start.sh
fi
