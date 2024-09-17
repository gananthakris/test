module.exports = {
  id: 'general',
  title: 'General',
  nested: [
    require('./sizeof'),
    require('./mem-addr'),
    require('./decl-to-desc'),
    require('./desc-to-decl'),
    // require('./fork-output'),
    // require('./pipes-true-false'),
    // require('./umask'),
    // require('./file-dir-true-false'),
    // require('./perms'),
    // require('./processes-true-false'),
    // require('./posix-ipc-true-false'),
    // require('./procrel'),
    // require('./procrel-true-false'),
    // require('./socket-api'),
    // require('./stdio-buffers'),
  ],
};

