#include "stack.h"

#include <assert.h>
#include <ctype.h>
#include <errno.h>
#include <stdio.h>
#include <string.h>


/** Crude test program: accepts int's from stdin interspersed with
 *  postfix operators:
 *
 *   integer::
 *     Push integer value on stack (integer may have - sign, but no + sign).
 *   '+'::
 *     Replace top 2 stack entries by their sum.
 *   '*'::
 *     Replace top 2 stack entries by their sum.
 *   '>'::
 *     Pop and print top stack entry.
 *
 *  No error checking.
 *
 *  An example log follows:
 *
 * 12 13 + 2 * >
 * 50
 * 9 -5 * 2 + >
 * -43
 */



static int add_op(int i1, int i2) { return i1 + i2; }
static int mul_op(int i1, int i2) { return i1 * i2; }

static void
add_mul(Stack *stack, int (*f)(int, int))
{
  StackEntry entry1 = pop_stack(stack);
  StackEntry entry2 = pop_stack(stack);
  int i1 = (int)entry1, i2 = (int)entry2;
  push_stack(stack, (StackEntry)f(i1, i2));
}

static void
push(Stack *stack, FILE *in)
{
  int v;
  fscanf(in, "%d", &v);
  push_stack(stack, (StackEntry)v);
}

static void
pop(Stack *stack, FILE *out)
{
  int i = (int)pop_stack(stack);
  fprintf(out, "%d\n", i); fflush(out);
}

static void
stack_ops(Stack *stack, FILE *in, FILE *out)
{
  int c;
  while ((c = fgetc(in)) != EOF) {
    int err;
    while (isspace(c)) { c = fgetc(in); }
    if (c == EOF) break;
    if (isdigit(c) || c == '-') {
      ungetc(c, in);
      push(stack, in);
    }
    else {
      switch (c) {
      case '+':
        add_mul(stack, add_op);
        break;
      case '*':
        add_mul(stack, mul_op);
        break;
      case '>':
        pop(stack, out);
        break;
      default:
        break;
      } //switch
    } //else !isdigit(c)
  } //while (c != EOF);
}

int main() {
  Stack *stack;
  //make sure we can stuff a int into a StackEntry.
  assert(sizeof(int) <= sizeof(StackEntry));
  stack = new_stack();
  stack_ops(stack, stdin, stdout);
  free_stack(stack);
  return 0;
}
