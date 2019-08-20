const path = require('path'),
	zlib = require('zlib'),
	fs = require('fs-extra');

console.log('Compressing dist files');

const distDir = path.join(process.cwd(), 'dist');
const extensions = /\.(js|css|svg|ttf|eot|otf)$/i;
const files = fs.readdirSync(distDir);
const options = {
	level: 9,
};
files.forEach(async file => {
	if (file.match(extensions)) {
		const input = fs.readFileSync(path.join(distDir, file));
		const output = zlib.gzipSync(input, options);
		fs.writeFileSync(path.join(distDir, `${file}.gz`), output);
	}
});

console.log('✓ Successfully compressed dist files');
