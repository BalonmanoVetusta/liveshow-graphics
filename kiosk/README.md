## Setup necessary packages


## Remove innecessary packages


```bash
sudo apt purge -f -y xscreensaver*
sudo apt purge -f -y scratch scratch2 nuscratch
sudo apt purge -f -y sonic-pi idle3
sudo apt purge -f -y smartsim java-common
sudo apt purge -f -y minicraft-pi libreoffice*

sudo apt clean
sudo apt autoremove -y
```

### Update & upgrade

```bash
sudo apt update -y
sudo apt upgrade -y
```

### Desktop GUI

`xfce` is a desktop gui  in case you already has a GUI installed, you can skip those packages.

```bash
sudo apt install -y xfce4 xfce4-terminal rc-gui
```

### Tools to hide cursor & browser

```bash
sudo apt install -y x11-xserver-utils unclutter sed chromium
```

### Create binary to execute browser in kiosk mode

```bash
mkdir -p ~/bin
touch ~/bin/kiosk
chmod u+x ~/bin/kiosk
```

Edit with your favorite editor `~/bin/kiosk` and add the following content:

```
#!/usr/bin/env bash

KIOSK_URL="${KIOSK_URL:-"http://localhost:9090/bundles/handball-liveshow-spain/graphics/live.html"}"

xset s noblank
xset s off
xset -dpms

unclutter -idle 0.5 -root &
sed -i 's/"exited_cleanly":false/"exited_cleanly":true/' "${HOME}/.config/chromium/Default/Preferences"
sed -i 's/"exit_type":"Crashed"/"exit_type":"Normal"/' "${HOME}/.config/chromium/Default/Preferences"

/usr/bin/chromium --noerrdialogs --disable-infobars --kiosk "${KIOSK_URL}" &
```

### Create auto start file

```bash
touch ~/.config/autostart/kiosk.desktop
```

Add the following content to `~/.config/autostart/kiosk.desktop`:

```
[Desktop Entry]
Version=1.0
Encoding=UTF-8
Name=Script
Type=Application
Exec="/home/pi/bin/kiosk"
Icon=
Terminal=false
StartupNotify=false
Hidden=false
GenericName=Kiosk
```

Now you can restart your raspberry pi and it should start the browser in kiosk mode. Don't worry about unstarted nodecg, when nodecg starts it will automatically reload the browser.
