#student startup file for csh-type login shells
setenv COURSE cs571
#[ -e ~/$COURSE ] || ln -f -s ~umrigar/$COURSE ~/$COURSE >& /dev/null
[ -e ~/.emacs ] || ln -s ~umrigar/$COURSE/bin/student.emacs ~/.emacs >& /dev/null

mkdir -p $HOME/tmp

#~/$COURSE/bin/login-changes.rb $COURSE

(cd $HOME/git-repos/$COURSE; git pull)

#setenv PATH "$HOME/$COURSE/bin:/opt/local/bin:/opt/sfw/bin:$PATH"
setenv PATH "$HOME/$COURSE/bin:$PATH"

#if ( ${?MANPATH} == 0 ) then
#  setenv MANPATH $HOME/$COURSE/man
#else
#  setenv MANPATH $HOME/$COURSE/man:$MANPATH
#endif

if ( ${?LD_LIBRARY_PATH} == 0 ) then
  setenv LD_LIBRARY_PATH .:$HOME/$COURSE/lib
else
  setenv LD_LIBRARY_PATH .:$HOME/$COURSE/lib:$LD_LIBRARY_PATH
endif

if ( ${?CLASSPATH} == 0 ) then
  setenv CLASSPATH .:$HOME/$COURSE/lib
else
  setenv CLASSPATH .:$HOME/$COURSE/lib:$CLASSPATH
endif

