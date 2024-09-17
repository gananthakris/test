#ifdef TEST_SORTED_COLL

#include "errnum.h"
#include "sorted-int-list.h"
#include "sorted-int-vec.h"

#include <errors.h>
#include <memalloc.h>

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

#include <errors.h>

static void
print(int value, void *ctx)
{
  printf("%d ", value);
}

int
main(int argc, const char *argv[]) {
  if (argc == 1) fatal("usage: %s INT...", argv[0]);
  ErrNum err;

  for (int c = 0; c < 2; c++) {
    printf("*** Sorted %s\n",
           (c == 0) ? "List" : "Vec");
    IntColl *coll = (c == 0)
      ? (IntColl *) makeSortedList(&err)
      :  (IntColl *) makeSortedVec(&err);
    if (err != NO_ERR) {
        fatal("makeSorted%s() %d",
              c == 0 ? "vec" : "list", err);
    }

    for (int i = 1; i < argc; i++) {
      coll->fns->add(coll, atoi(argv[i]), &err);
      if (err != NO_ERR) {
        fatal("add() error %d", err);
      }
    }

    coll->fns->iterate(coll, print, NULL); printf("\n");

    while (coll->fns->size(coll) > 0) {
      size_t rmIndex = coll->fns->size(coll) - 1;
      coll->fns->rm_at_index(coll, rmIndex, &err);
      if (err != NO_ERR) {
        fatal("rm_at_index() error %d", err);
      }
      coll->fns->iterate(coll, print, NULL);
      printf("\n");
    }
    coll->fns->free(coll);
  }
}

#endif
