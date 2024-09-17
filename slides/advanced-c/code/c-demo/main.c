#include "f1.h"
#include "f2.h"

#include <stdio.h>
#include <stdlib.h>

int main(int argc, const char *argv[]) {
  int a = atoi(argv[1]);
  int b = atoi(argv[2]);
  printf("value is %d\n", f1(a, b) + f2(a, b));
  return 0;
}
