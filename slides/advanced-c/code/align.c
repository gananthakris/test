#include <stddef.h>
#include <stdio.h>

//.1.
typedef struct {
  int i;
  char c;      //pad 3
  double d;
  char arr[3]; //pad 5
} BadAlign;

//static ensures not visible outside this file
static BadAlign bads[4];

typedef struct {
  char c;
  char arr[3];
  int i;
  double d;
} GoodAlign;

static GoodAlign goods[4];


//.2.
int main() {
  printf("BadAlign: i@%zu, c@%zu, d@%zu, arr@%zu\n"
         "sizeof(BadAlign) = %zu, sizeof bads = %zu\n",
         offsetof(BadAlign, i), offsetof(BadAlign, c),
         offsetof(BadAlign, d), offsetof(BadAlign, arr),
         sizeof(BadAlign), sizeof bads);

  printf("GoodAlign: c@%zu, arr@%zu, i@%zu, d@%zu\n"
         "sizeof(GoodAlign) = %zu, sizeof goods = %zu\n",
         offsetof(GoodAlign, c), offsetof(GoodAlign, arr),
         offsetof(GoodAlign, i), offsetof(GoodAlign, d),
         sizeof(GoodAlign), sizeof goods);

}
