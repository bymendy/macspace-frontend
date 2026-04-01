const sharp = require("sharp");
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach((size) => {
  sharp("src/assets/icons/logo-macspace.png")
    .resize(size, size)
    .toFile(`src/assets/icons/icon-${size}x${size}.png`, (err) => {
      if (err) console.error(err);
      else console.log(`✅ icon-${size}x${size}.png généré`);
    });
});
