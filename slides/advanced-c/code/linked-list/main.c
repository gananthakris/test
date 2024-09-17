#include "linked-list.h"

#include <stdio.h>

//.1.
static void
print(const char *str, void *ctx)
{
  fprintf((FILE *)ctx, "%s\n", str);
}

int
main(int argc, const char *argv[])
{
  LinkedList *list = make_linked_list();
  for (int i = 1; i < argc; i++) {
    insert_linked_list(list, argv[i]);
  }
  iterate_linked_list(list, print, stdout);
  free_linked_list(list);
}
