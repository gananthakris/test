#ifdef TEST_COLL_PERF

#include "errnum.h"
#include "sorted-int-list.h"
#include "sorted-int-vec.h"

#include <errors.h>
#include <memalloc.h>

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>


static void
gen_rand_entries(int nEntries, int entries[nEntries])
{
  for (int i = 0; i < nEntries; i++) {
    entries[i] = rand();
  }
}

static clock_t
bench(IntColl *coll, int nEntries, int entries[nEntries])
{
  ErrNum err = NO_ERR;
  clock_t t0 = clock();
  for (int i = 0; i < nEntries; i++) {
    coll->fns->add(coll, entries[i], &err);
    if (err != NO_ERR) fatal("add() error at index %d: %d", i, err);
  }
  while (coll->fns->size(coll) > 0) {
    size_t rmIndex = rand() % coll->fns->size(coll);
    coll->fns->rm_at_index(coll, rmIndex, &err);
    if (err != NO_ERR) fatal("rm_at_index() error %d", err);
  }
  clock_t t1 = clock();
  return t1 - t0;
}

int
main(int argc, const char *argv[])
{
  const int nArgs = argc - 1;
  long args[nArgs];
  for (int i = 0; i < nArgs; i++) args[i] = atol(argv[i + 1]);

  ErrNum err = NO_ERR;
  clock_t times[2][nArgs];

  for (int a = 0; a < nArgs; a++) {
    int *entries = mallocChk(args[a] * sizeof(int));
    gen_rand_entries(args[a], entries);
    for (int c = 0; c < 2; c++) {
      IntColl *coll = (c == 0)
        ? (IntColl *) makeSortedList(&err)
        :  (IntColl *) makeSortedVec(&err);
      if (err != NO_ERR) {
        fatal("makeSorted%s() %d", c == 0 ? "vec" : "list", err);
      }
      times[c][a] = bench(coll, args[a], entries);
      coll->fns->free(coll);
    }
    free(entries);
  }

  const int w = 12;
  printf("#%*s%*s%*s\n", w - 1, "nEntries", w, "list millis", w, "vec millis");
  for (int a = 0; a < nArgs; a++) {
    printf("%*ld", w, args[a]);
    for (int c = 0; c < 2; c++) {
      printf("%*ld", w, (long)(times[c][a]*1000/CLOCKS_PER_SEC));
    }
    printf("\n");
  }

}


#endif
