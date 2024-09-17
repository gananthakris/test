#include "sorted-int-list.h"

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
  Node hdr;
} SortedIntList;


/** add val to this collection and return index of entry */
static size_t
add(void *coll, int value, ErrNum *err)
{
  size_t index = 0;
  Node *newNode = malloc(sizeof(Node));
  if (!newNode) {
    *err = MEM_ALLOC_ERR;
  }
  else {
    SortedIntList *list = coll;
    Node *p0; //lagging pointer
    Node *p1; //current pointer
    for (p0 = &list->hdr, p1 = p0->next;
         p1 != NULL && p1->value <= value;
         p0 = p1, p1 = p1->next) {
      index++;
    }
    newNode->value = value; newNode->next = p1;
    p0->next = newNode;
    list->nEntries++;
  }
  return index;
}

/** remove element at index from this collection and return
 *  value of removed entry.
 */
static int
rm_at_index(void *coll, size_t index, ErrNum *err)
{
  SortedIntList *list = coll;
  int value = 0;
  if (index >= list->nEntries) {
    *err = BAD_INDEX_ERR;
  }
  else {
    Node *p0; //lagging pointer
    size_t i;
    for (i = 0, p0 = &list->hdr;
         i < index && p0->next != NULL;
         i++, p0 = p0->next) {
    }
    assert(i == index);
    assert(p0->next != NULL);
    Node *p1 = p0->next;
    value = p1->value;
    p0->next = p1->next;
    list->nEntries--; free(p1);
  }
  return value;
}

/** return # of entries in this collection */
static size_t
size(const void *coll)
{
  const SortedIntList *list = coll;
  return list->nEntries;
}

/**  call iterateFn() for each value in this collection */
static void
iterate(void *coll, void (*iterateFn)(int value, void *ctx), void *ctx)
{
  const SortedIntList *list = coll;
  for (Node *p = list->hdr.next; p != NULL; p = p->next) {
    iterateFn(p->value, ctx);
  }
}


/** free this collection result */
static void
free_sorted_int_list(void *coll)
{
  SortedIntList *list = coll;
  Node *p1 = NULL;
  for (Node *p0 = &list->hdr; p0 != NULL; p0 = p1) {
    Node *p1 = p0->next;
    free(p1);
  }
  free(list);
}

static IntCollFns opFns = {
  .add = add,
  .rm_at_index = rm_at_index,
  .size = size,
  .iterate = iterate,
  .free = free_sorted_int_list,
};

IntColl
*makeSortedList(ErrNum *err)
{
  SortedIntList *list = calloc(1, sizeof(SortedIntList));
  if (!list) {
    *err = MEM_ALLOC_ERR;
    return 0;
  }
  else {
    list->fns = &opFns;
    return (IntColl *)list;
  }
}


#ifdef TEST_SORTED_INT_LIST

#include <errors.h>

static void
print(int value, void *ctx)
{
  printf("%d ", value);
}

static int values[] = { 22, 11, -2, 4, 77, 33 };

int main() {
  printf("*** TESTING sorted-int-list\n");
  const size_t n = sizeof(values)/sizeof(values[0]);
  ErrNum err;

  IntColl *list = makeSortedList(&err);
  if (err != NO_ERR) fatal("error %d", err);

  for (int i = 0; i < n; i++) {
    list->fns->add(list, values[i], &err);
    if (err != NO_ERR) fatal("add() error %d", err);
  }
  list->fns->iterate(list, print, NULL); printf("\n");
  while (list->fns->size(list) > 0) {
    list->fns->rm_at_index(list, list->fns->size(list) - 1, &err);
    if (err != NO_ERR) fatal("rm_at_index() error %d", err);
    list->fns->iterate(list, print, NULL); printf("\n");
  }
  list->fns->free(list);
}


#endif //#ifdef TEST_SORTED_INT_LIST
