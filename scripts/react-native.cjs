const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const cache = path.join(root, '.cache');
const temporary = path.join(cache, 'tmp');
const gradle = path.join(cache, 'gradle');
const npmCache = path.join(cache, 'npm');
for (const directory of [temporary, gradle, npmCache]) {
  fs.mkdirSync(directory, { recursive: true });
}

// Keep this process and all CLI/Gradle/Java children on the project drive.
// No global environment variables or caches on other drives are modified.
const javaTemporary = temporary.split(path.sep).join('/');
const env = {
  ...process.env,
  GRADLE_USER_HOME: gradle,
  TEMP: temporary,
  TMP: temporary,
  TMPDIR: temporary,
  npm_config_cache: npmCache,
  JAVA_TOOL_OPTIONS: [
    process.env.JAVA_TOOL_OPTIONS,
    `-Djava.io.tmpdir="${javaTemporary}"`,
  ]
    .filter(Boolean)
    .join(' '),
};

const cli = path.join(root, 'node_modules', 'react-native', 'cli.js');
if (!fs.existsSync(cli)) {
  console.error('Chua cai thu vien. Chay npm.cmd ci trong thu muc du an.');
  process.exitCode = 1;
} else {
  console.log(`Gradle cache: ${gradle}`);
  console.log(`Temporary files: ${temporary}`);
  if (process.argv[2] === 'run-android') {
    const devices = spawnSync('adb', ['devices'], {
      encoding: 'utf8',
      windowsHide: true,
    });
    const serials = (devices.stdout ?? '')
      .split(/\r?\n/)
      .map(line => /^(\S+)\s+device$/.exec(line.trim())?.[1])
      .filter(Boolean);
    for (const serial of serials) {
      const result = spawnSync(
        'adb',
        ['-s', serial, 'reverse', 'tcp:3000', 'tcp:3000'],
        { encoding: 'utf8', windowsHide: true },
      );
      if (result.status !== 0) {
        console.warn(
          `API port forwarding failed for ${serial}. Run adb reverse tcp:3000 tcp:3000.`,
        );
      }
    }
  }
  const child = spawn(process.execPath, [cli, ...process.argv.slice(2)], {
    cwd: root,
    env,
    stdio: 'inherit',
  });
  child.on('error', error => {
    console.error(error.message);
    process.exitCode = 1;
  });
  child.on('close', code => {
    process.exitCode = code ?? 1;
  });
}
