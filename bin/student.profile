#student startup file for login sh-type shells
COURSE=cs571

[ -e ~/.emacs ] || ln -s ~umrigar/$COURSE/bin/student.emacs ~/.emacs >& /dev/null

mkdir -p $HOME/tmp

(cd $HOME/$COURSE; git pull)

PATH="$HOME/$COURSE/bin:$PATH"
export PATH

#if [ -z "$MANPATH" ]; then
#  MANPATH=$HOME/$COURSE/man
#else
#  MANPATH=$HOME/$COURSE/man:$MANPATH
#fi
#export MANPATH

if [ -z "$LD_LIBRARY_PATH" ]; then
  LD_LIBRARY_PATH=.:$HOME/$COURSE/lib
else
  LD_LIBRARY_PATH=.:$HOME/$COURSE/lib:$LD_LIBRARY_PATH
fi
export LD_LIBRARY_PATH

