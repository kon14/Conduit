#!/bin/sh

# Installation: sh <(curl -s https://getconduit.dev/bootstrap)

[[ $1 = '--no-deploy' ]] && deploy="false" || deploy="true"

uname=$(uname -a)
website="https://getconduit.dev"

# Detect Platform
if [[ $uname =~ "Linux" ]]; then
  platform="linux"
elif [[ $uname =~ "Darwin" ]]; then
  platform="darwin"
else
  echo "Could not automatically detect your platform."
  echo "Please follow the installation instructions in ${website}"
  exit
fi

# Detect Architecture
if [[ $uname =~ "arm64" ]] || [[ $uname =~ "aarch64" ]]; then
  arch="arm"
elif [[ $uname =~ "x86_64" ]]; then
  arch="x64"
else
  echo "Could not automatically detect your system's architecture."
  echo "Please follow the installation instructions in ${website}"
  exit
fi

# Locate Latest CLI Release
target_line=$(curl -s 'https://api.github.com/repos/ConduitPlatform/CLI/releases/latest' | grep '"name": "conduit-v' | grep ${platform} | grep ${arch})
file=$(echo ${target_line} | sed -e 's/.*"name": "\(.*\)",.*/\1/')
tag=$(echo ${file} | cut -d '-' -f 2)
download_url="https://github.com/ConduitPlatform/CLI/releases/download/${tag}/${file}"

# Install Conduit
rm -f conduit-cli.tar.gz
echo "Downloading Conduit CLI..."
curl -Lso conduit-cli.tar.gz ${download_url}
rm -rf ~/.conduit
mkdir ~/.conduit
echo "Extracting Archive..."
tar xf conduit-cli.tar.gz --strip-components=1 -C ~/.conduit
rm -f conduit-cli.tar.gz
chmod a+x ~/.conduit/bin/conduit

# Add To Executable Path
shell_detected='false'
already_installed='false'
if which zsh >> /dev/null 2>&1; then
  shell_detected='true'
  if ! grep 'export PATH=$PATH:~/.conduit/bin' ~/.zshrc >> /dev/null 2>&1; then
    echo "Adding Conduit CLI to Zsh"
    printf '\n# Add Conduit CLI to executable PATH\nexport PATH=$PATH:~/.conduit/bin\n' >> ~/.zshrc
  else
    already_installed='true'
  fi
fi
if which bash >> /dev/null 2>&1; then
  shell_detected='true'
  if ! grep 'export PATH=$PATH:~/.conduit/bin' ~/.bashrc >> /dev/null 2>&1; then
    echo "Adding Conduit CLI to Bash"
    printf '\n# Add Conduit CLI to executable PATH\nexport PATH=$PATH:~/.conduit/bin\n' >> ~/.bashrc
  else
      already_installed='true'
  fi
fi
if [[ $shell_detected == "false" ]]; then
  printf '\nShell auto-detection failed. Could not update executable $PATH.\n';
  echo "Conduit CLI located in ~/.conduit/bin/conduit"
elif [[ $already_installed == 'false' ]]; then
  printf "\nTo ensure that 'conduit' is available, please open a new terminal window.\n"
fi

# Bootstrap Local Deployment
if [[ $deploy == "true" ]]; then
  printf "\n"
  ~/.conduit/bin/conduit deploy setup --config
fi
