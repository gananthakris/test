#include "sorted-int-vec.h"

#include "errnum.h"
#include "int-coll.h"

#include <assert.h>
#include <stdbool.h>
#include <stdlib.h>

typedef struct _Node {
  int value;
  struct _Node *next;
} Node;

typedef struct {
  IntCollFns *fns;
  size_t nEntries;
  size_t capacity;
  int *entries;
} SortedIntVec;


enum {
  INIT_CAPACITY = 2,
};

/** add val to this collection and return index of entry */
static size_t
add(void *coll, int value, ErrNum *err)
{
  SortedIntVec *vec = coll;
  if (vec->nEntries >= vec->capacity) {
    size_t newCapacity = (vec->capacity == 0) ? INIT_CAPACITY : 2*vec->capacity;
    int *entries = realloc(vec->entries, newCapacity*sizeof(int));
    if (!entries) {
      *err = MEM_ALLOC_ERR;
      return 0;
    }
    vec->capacity = newCapacity; vec->entries = entries;
  }
  size_t index;
  for (index = 0;
       index < vec->nEntries && vec->entries[index] <= value;
       index++) {
  }
  assert(vec->nEntries < vec->capacity);
  for (size_t j = vec->nEntries; j > index; j--) {
    vec->entries[j] = vec->entries[j - 1];
  }
  vec->entries[index] = value;
  vec->nEntries++;
  return index;
}

/** remove element at index from this collection and return
 *  value of removed entry.
 */
static int
rm_at_index(void *coll, size_t index, ErrNum *err)
{
  SortedIntVec *vec = coll;
  int value = 0;
  if (index >= vec->nEntries) {
    *err = BAD_INDEX_ERR;
  }
  else {
    //totally unnecessary initial loop for
    int i;
    for (i = 0; i < index; i++) {
    }
    value = vec->entries[i];
    for (int j = i + 1; j < vec->nEntries; j++) {
      vec->entries[j - 1] = vec->entries[j];
    }
    vec->nEntries--;
  }
  return value;
}

/** return # of entries in this collection */
static size_t
size(const void *coll)
{
  const SortedIntVec *vec = coll;
  return vec->nEntries;
}

/**  call iterateFn() for each value in this collection */
static void
iterate(void *coll, void (*iterateFn)(int value, void *ctx), void *ctx)
{
  const SortedIntVec *vec = coll;
  for (int i = 0; i < vec->nEntries; i++) {
    iterateFn(vec->entries[i], ctx);
  }
}


/** free this collection result */
static void
free_sorted_int_vec(void *coll)
{
  SortedIntVec *vec = coll;
  free(vec->entries);
  free(vec);
}

static IntCollFns opFns = {
  .add = add,
  .rm_at_index = rm_at_index,
  .size = size,
  .iterate = iterate,
  .free = free_sorted_int_vec,
};

IntColl
*makeSortedVec(ErrNum *err)
{
  SortedIntVec *vec = calloc(1, sizeof(SortedIntVec));
  if (!vec) {
    *err = MEM_ALLOC_ERR;
    return 0;
  }
  else {
    vec->fns = &opFns;
    return (IntColl *)vec;
  }
}


#ifdef TEST_SORTED_INT_VEC

#include <errors.h>

static void
print(int value, void *ctx)
{
  printf("%d ", value);
}

static int values[] = { 22, 11, -2, 4, 77, 33 };

int main() {
  printf("*** TESTING sorted-int-vec\n");
  const size_t n = sizeof(values)/sizeof(values[0]);
  ErrNum err;

  IntColl *vec = makeSortedVec(&err);
  if (err != NO_ERR) fatal("error %d", err);

  for (int i = 0; i < n; i++) {
    vec->fns->add(vec, values[i], &err);
    if (err != NO_ERR) fatal("add() error %d", err);
  }
  vec->fns->iterate(vec, print, NULL); printf("\n");
  while (vec->fns->size(vec) > 0) {
    vec->fns->rm_at_index(vec, vec->fns->size(vec) - 1, &err);
    if (err != NO_ERR) fatal("rm_at_index() error %d", err);
    vec->fns->iterate(vec, print, NULL); printf("\n");
  }
  vec->fns->free(vec);
}


#endif //#ifdef TEST_SORTED_INT_VEC
