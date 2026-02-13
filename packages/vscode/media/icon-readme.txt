The package.json references media/icon.png for the extension icon.

To create the icon from icon.svg:
1. Use an online converter like https://cloudconvert.com/svg-to-png
2. Upload icon.svg
3. Set dimensions to 128x128 pixels
4. Download as icon.png and place in this directory

Or use ImageMagick:
  convert icon.svg -resize 128x128 icon.png

Or use Inkscape:
  inkscape icon.svg --export-png=icon.png --export-width=128 --export-height=128
