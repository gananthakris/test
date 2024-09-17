#include <stdio.h>
#include <stdlib.h>

//.1.
static char strSpace[1000];
static char msg[] = "hello";

//argv[argc] program arguments
//(includes executable name in argv[0])
int main(int argc, const char *argv[]) {
  char *ptr = malloc(argc * sizeof(char *));
  char *home = getenv("HOME");
  int vals[10];

  printf("%p: &main (code)\n", &main);
  printf("%p: &msg (initialized data)\n", &msg);
  printf("%p: &strSpace (uninitialized data)\n\n", &strSpace);

  printf("%p: ptr (heap data)\n\n", ptr);
  printf("%p: &argv (block data)\n", &argv);
  printf("%p: &argc (block data)\n", &argc);
  printf("%p: &ptr (block data)\n", &ptr);
  printf("%p: &home (block data)\n", &home);
  printf("%p: &vals (block data)\n\n", &vals);

  printf("%p: &argv[0] (commmand-line arg)\n", &argv[0]);
  printf("%p: home (env var)\n", home);

  free(ptr);
}
