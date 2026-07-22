# @tuicons/cli

Search TUIcons, preview icons, and diagnose terminal font configuration.

```sh
npm install --global @tuicons/cli

tuicons search music
tuicons show folder --mode ascii
tuicons doctor
tuicons setup
```

During SSH, the local terminal renders glyphs; installing a font only on the
remote host does not configure the local terminal. TUIcons therefore stays in
Unicode mode until Nerd Font output is explicitly enabled.

See the [main TUIcons documentation](https://github.com/rexroze/tuicons#readme)
for available modes and library packages.

[MIT](LICENSE)
