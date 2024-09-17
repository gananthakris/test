#include <stdio.h>

//.1.
int main() {
  union {
    unsigned u;
    struct {
      // bit fields of size 4
      unsigned u1: 4;
      unsigned u2: 4;
      unsigned u3: 4;
      unsigned u4: 4;
      unsigned u5: 4;
      unsigned u6: 4;
      unsigned u7: 4;
      unsigned u8: 4;
    };
  } u =
    { .u1 = 0xd, .u2 = 0xe, .u3 = 0xa, .u4 = 0xd,
      .u5 = 0xb, .u6 = 0xe, .u7 = 0xe, .u8 = 0xf,
    };
  printf("unsigned u = 0x%x\n", u.u);
}
