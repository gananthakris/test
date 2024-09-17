'use strict';

const TIMESTAMP = 'Time-stamp: <2022-03-27 23:29:33 umrigar>';

const {TrueFalseQuestion, Rand, umtParse, emacsTimestampToMillis} =
  require('gen-q-and-a');

class FileDirTrueFalse extends TrueFalseQuestion {

  constructor(params) {
    super(params, STATEMENTS);
  }

}

const STATEMENTS = [
  { // 1
    statement: `
      Hard links cannot span filesystems.
    `,
    value: true,
    explain: `
      A hard link essentially is a directory entry containing 
      the file name and inode number.  Since inodes are
      local to a filesystem, hard links cannot span filesystems.
    `,
  },
  { // 2
    statement: `
      Symbolic links cannot span filesystems.
    `,
    value: false,
    explain: `
      A symbolic link simply contains a path; this path can
      point anywhere within the directory hierarchy, including
      other filesystems. 
    `,
  },
  { // 3
    statement: `
      It is possible that a file cannot be read by its owning user
      but can be read by other users.
    `,
    value: true,
    explain: `
      Permissions are checked sequentially, first for the owner,
      then for group and finally for other (users other than owner
      and group). Hence if the file has permissions like
      \`--w-r--r--\`, the owner will not have read access wherease
      other users will be able to read it. 
    `,
  },
  { // 4
    statement: `
      The content of a file is removed once the number of hard links
      pointing to the file becomes zero.
    `,
    value: false,
    explain: `
      The content of a file is removed once the number of hard links
      pointing to the file becomes zero *and* no process has that
      file open. 
    `,
  },
  { // 5
    statement: `
      The effective user id of a process (which may be different
      from that of the real user running the process) is used
      for all permission checks.
    `,
    value: true,
    explain: `
      The effective user id of the process can diverge from that of
      the real user id for setuid executables and it is what is used
      for all permission checks involving user permissions.
    `,
  },
  { // 6
    statement: `
      Each file on a filesystem has a unique \`stat\` structure.
    `,
    value: false,
    explain: `
      Multiple files could be hard links to the same inode and
      could consequently share the same \`stat\` structure.
    `,
  },
  { // 7
    statement: `
      The owner UID of a newly created file is set to the
      real user ID of the user creating the file.
    `,
    value: false,
    explain: `
      The owner UID is set to the *effective* UID of the
      process creating the file; this may be different
      from the real UID, for setuid executables.
    `,
  },
  { // 8
    statement: `
      Files in a non-readable directory cannot be accessed.
    `,
    value: false,
    explain: `
      If a directory is non-readable, then its contents cannot
      be listed.  However, if the directory has execute
      permissions, then it can be searched for a particular
      file; i.e. a file within the directory whose name is 
      known can be accessed.
    `,
  },
  { // 9
    statement: `
      If a file \`FILE\` is created successfully using
      \`open(FILE, O_WRONLY|O_CREAT, 0666)\`, then the
      newly created file will allow all users read-write
      access.
    `,
    value: false,
    explain: `
      The final permissions are controlled by the process
      \`umask\`.  For example, if the process \`umask\`
      is set to \`0022\`, then write permissions are
      knocked out for group and other and the newly created
      file will have permissions \`0644\`.
    `,
  },
  { // 10
    statement: `
      The \`st_ctime\` in the \`stat\` structure for a file
      gives the creation time for the file.
    `,
    value: false,
    explain: `
      The \`st_ctime\` in the \`stat\` structure for a file
      is the time of last modification of the meta information
      associated with the file.  In fact, it is not possible
      to get the creation time of a file on most Unix systems.
    `,
  },
  { // 11
    statement: `
      If a directory's \`setgid\` bit is set, then newly created
      files and directories within the directory inherit the
      same group as the directory.
    `,
    value: false,
    explain: `
      Not only is the group inherited, but newly created directories
      also inherit the \`setgid\` bit.  That makes it possible
      to set up a directory with propagated group ownership,
      making it easier to share files.
    `,
  },
  { // 12
    statement: `
      If the S_ISVTX sticky bit is set on a directory, then a file can
      be removed from a directory if the user has write permission on
      the directory and either owns the file or directory, or is root
    `,
    value: true,
    explain: `
      This is typically used for directories like \`/tmp\` to allow
      users to create temporary files without allowing other users
      to delete them.
    `,
  },
  { // 13
    statement: `
      Unlinking a file specified by a particular path requires
      ."execute" permissions for all the directories in the path.
    `,
    value: true,
    explain: `
      Execute permissions for directories implies that those
      directories can be searched for a particular name; that
      is necessary in order to unlink a file.
    `,
  },
  { // 14
    statement: `
      Unlinking a file requires write permission in the directory
      containing the file.
    `,
    value: true,
    explain: `
      Since unlinking the file entails removing it from the directory,
      write permission on the directory is necessary.
    `,
  },

];

module.exports = FileDirTrueFalse;
Object.assign(FileDirTrueFalse, {
  id: 'fileDirTrueFalse',
  title: 'Files and Directories True/False',
  timestamp: emacsTimestampToMillis(TIMESTAMP),
  version: '1.0.0',
});



if (process.argv[1] === __filename) {
  console.log(new FileDirTrueFalse().qaText());
}
