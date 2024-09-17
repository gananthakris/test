#include <stdio.h>

#define COLORS \
  T(RED), \
  T(BLUE), \
  T(GREEN), \
  T(INDIGO), \
  T(WHITE), \
  T(BLACK),

#undef T
#define T(c) c ## _C
typedef enum { COLORS N_COLORS } Color;

#undef T
#define T(c) #c
const char *colors[] = { COLORS };

int
main()
{
  for (int i = 0; i < N_COLORS; i++) {
    printf("%d: %s\n", i, colors[i]);
  }
  return 0;
}

