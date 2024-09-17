#include <stdlib.h>
#include <stdio.h>
#include <string.h>

//.1.
int compare_geq(const void *p1, const void *p2) {
  return strcmp(*(const char **)p2, *(const char **)p1);
  //alternately:
  //- strcmp(*(const char **)p1, *(const char **)p2);
}

int
main(int argc, const char *argv[])
{
  const size_t nArgs =
    argc - 1;          //since argv[0] contains exec path

  //variable-length array (VLA) where # elements
  //determined at runtime
  const char *args[nArgs];

  memcpy(args, &argv[1], nArgs*sizeof(char *));
  qsort(args, nArgs, sizeof(char *), compare_geq);
  for (int i = 0; i < nArgs; i++) printf("%s\n", args[i]);
}
