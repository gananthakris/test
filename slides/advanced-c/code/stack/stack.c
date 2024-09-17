#include "stack.h"

#include <stdlib.h>

/** Stack implementation: fixed size with undefined behavior on overflow. */

//.stk0.
enum { MAX_STACK_SIZE = 10 };

struct StackImpl {
  /** index of next free entry. */
  int index;
  /** storage for stack entries */
  StackEntry entries[MAX_STACK_SIZE];
};

//.stk1.
Stack *
new_stack(void)
{
  return calloc(1, sizeof(Stack));
}

void
free_stack(Stack *s) {
  return free(s);
}

//.stk2.
void
push_stack(Stack *s, StackEntry e) {
  s->entries[s->index++] = e;
}

StackEntry
pop_stack(Stack *s) {
  return (s->index > 0) ? s->entries[--s->index] : NULL;
}

int
size_stack(const Stack *s) {
  return s->index;
}
