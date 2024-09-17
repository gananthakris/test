#include <stdio.h>

//.1.
int main() {
  // %zu used for print size_t
  printf("sizeof short = %zu\n", sizeof(short));
  printf("sizeof int = %zu\n", sizeof(int));

  printf("sizeof float = %zu\n", sizeof(float));
  printf("sizeof double = %zu\n", sizeof(double));

  const char hello[] = "hello";
  printf("sizeof \"hello\" = %zu\n", sizeof hello);

  const char message[] = {'h', 'e', 'l','l', 'o' };
  printf("sizeof {'h', 'e', 'l','l', 'o' } = %zu\n",
         sizeof message);
}
