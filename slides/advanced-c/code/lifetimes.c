#include <stdio.h>
#include <stdlib.h>
#include <string.h>

//.1.
//static allocation
const char *GREET = "hello";

const char *greetMsg(const char *greetee)
{
  //manual heap allocation
  char *msg = malloc(strlen(GREET) + 1 + strlen(greetee) + 1);
  sprintf(msg, "%s %s", GREET, greetee);

  //return heap allocated message
  return msg;
}

int main() {
  //stack allocation
  const char greetee[] = "world";

  //msg will point to heap
  const char *msg = greetMsg(greetee);
  printf("%s\n", msg);

  //manual heap deallocation
  free((void *)msg); //cast to remove const
  return 0;
}
