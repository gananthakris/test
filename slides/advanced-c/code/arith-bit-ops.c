#include <stdio.h>


int main() {

  //.1.
  //associativity and precedence
  printf("1-2-3 = (1-2)-3 = %d, "
         "2 + 6*5/3 = 2 + ((6*5)/3) = %d\n",
         1-2-3, 2 + 6*5/3);
  //1-2-3 = (1-2)-3 = -4, 2 + 6*5/3 = 2 + ((6*5)/3) = 12


  //integer division truncates towards 0
  printf("10/4 = %d, -10/4 = %d\n", 10/4, -10/4);
  //10/4 = 2, -10/4 = -2

  //remainder has sign of dividend
  //concatenation of adjacent string literals
  printf("10%%4 = %d, -10%%4 = %d, "
         "10%%-4 = %d, -10%%-4 = %d\n",
         10%4, -10%4, 10%-4, -10%-4);
  //10%4 = 2, -10%4 = -2, 10%-4 = 2, -10%-4 = -2

  //.2.
  //& bitwise-and; | bitwise-or;
  printf("3|5 = %d, 3&5 = %d\n", 3|5, 3&5);
  //3|5 = 7, 3&5 = 1

  //~ does bitwise complement, %x prints hex
  printf("~0 = %d = 0x%x, ~-1 = 0x%x\n", ~0, ~0, ~-1);
  //~0 = -1 = 0xffffffff, ~-1 = 0x0

  //<< left-shift; >> right-shift;
  //u-suffix on literal makes it unsigned
  printf("7 << 3 = 0x%x, ~0 << 2 = 0x%x\n"
         "~0 >> 2 = 0x%x, ~0u >> 2 = 0x%x\n",
         7 << 3, ~0 << 2, ~0 >> 2, ~0u >> 2);
  //7 << 3 = 0x38, ~0 << 2 = 0xfffffffc
  //~0 >> 2 = 0xffffffff, ~0u >> 2 = 0x3fffffff
  //.3.

}
