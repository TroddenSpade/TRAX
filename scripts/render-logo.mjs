import sharp from 'sharp';
await sharp('public/logo.svg').resize(512, 512).png().toFile('/tmp/trax-logo-preview.png');
