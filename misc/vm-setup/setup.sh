#!/usr/bin/sh

mkdir -p ~/Downloads; cd ~/Downloads

sudo apt update

#https://linuxconfig.org/ubuntu-22-04-system-backup-and-restore>
sudo apt install -y timeshift
TIMESHIFT_DEV=/dev/mapper/ubuntu--vg-ubuntu--lv
sudo timeshift --create --snapshot-device $TIMESHIFT_DEV
sudo timeshift --list --snapshot-device $TIMESHIFT_DEV

sudo apt install -y curl

#<https://wiki.lxde.org/en/Installation>
#installing lubuntu-core did not work
#following command worked but snap firefox hung.
sudo apt -y install lxde
sudo apt install -y gnome-system-tools

#x2go remote desktop
#sudo apt-add-repository ppa:x2go/stable
#sudo apt update
sudo apt install -y x2goserver x2goclient x2goserver-xsession

#set up for automatic unattended upgrades; important for security
sudo apt install -y unattended-upgrades

#popular revision control system
sudo apt install -y git 

#install packages which may be necessary in building native js modules
sudo apt install -y software-properties-common build-essential libssl-dev
sudo apt install -y apt-transport-https

#install nodejs
curl -fsSL https://deb.nodesource.com/setup_21.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

#install npm
#sudo apt install -y npm
sudo npm install -g npm

#install bun
sudo snap install bun-js

#<https://www.mongodb.com/community/forums/t/installing-mongodb-over-ubuntu-22-04/159931/89?page=5>
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc |  gpg --dearmor | sudo tee /usr/share/keyrings/mongodb.gpg > /dev/null
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install mongodb-org

# #mongo <https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/>
# wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | \
#     sudo apt-key add -
# #install for 20.04 instead of 22.04
# echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
# sudo apt update -y
# #install old version 1.1.1 of libssl (not available for 22.04).
# wget http://security.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.13_amd64.deb
# sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2.13_amd64.deb
# sudo apt install -y mongodb-org
# sudo systemctl enable mongod

#json query / pretty-printer
sudo apt install -y jq

#typescript for global playing-around (project-specific preferred)
sudo npm install -g typescript
sudo npm install -g ts-node

#editors
sudo apt install -y xauth emacs gedit vim

#atom: <https://linuxize.com/post/how-to-install-atom-text-editor-on-ubuntu-20-04/>
sudo snap install atom --classic

#visual studio code
#<https://code.visualstudio.com/docs/setup/linux>
sudo snap install --classic code

#sublime: <https://www.sublimetext.com/docs/linux_repositories.html>
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | \
    gpg --dearmor | \
    sudo tee /etc/apt/trusted.gpg.d/sublimehq-archive.gpg > /dev/null
echo "deb https://download.sublimetext.com/ apt/stable/" \
    | sudo tee /etc/apt/sources.list.d/sublime-text.list
sudo apt update -y && sudo apt install -y sublime-text

#remote desktop vnc
sudo apt install -y tightvncserver xtightvncviewer

#install autocutsel for VNC copy text between client and server
sudo apt install -y autocutsel

#google-chrome <https://itsfoss.com/install-chrome-ubuntu/>
sudo apt install -y xdg-utils
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt install -y fonts-liberation
sudo dpkg -i google-chrome-stable_current_amd64.deb

#ruby
sudo apt install -y ruby

#zig
curl -fsSL https://ziglang.org/download/0.11.0/zig-linux-x86_64-0.11.0.tar.xz \
     > zig.tar.xz
xzcat zig.tar.xz | tar -xf -
sudo cp zig-linux*/zig /usr/local/bin
sudo cp -r zig-linux*/lib /usr/local/lib/zig
rm -rf zig*

#firefox <https://www.omgubuntu.co.uk/2022/04/how-to-install-firefox-deb-apt-ubuntu-22-04>
#rm snap
sudo snap rm firefox
#add mozilla PPA
sudo add-apt-repository -y ppa:mozillateam/ppa
# ensure PPA priority over snap package (problem; non-existent cgroup)
echo '
Package: *
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 1001
' | sudo tee /etc/apt/preferences.d/mozilla-firefox
#upgrade automatically
echo 'Unattended-Upgrade::Allowed-Origins:: "LP-PPA-mozillateam:${distro_codename}";' | sudo tee /etc/apt/apt.conf.d/51unattended-upgrades-firefox
# install it
sudo apt install --allow-downgrades -y firefox

sudo timeshift --create --snapshot-device $TIMESHIFT_DEV
sudo timeshift --list --snapshot-device $TIMESHIFT_DEV
