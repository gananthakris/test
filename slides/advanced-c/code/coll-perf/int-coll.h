#ifndef INT_COLL_H_
#define INT_COLL_H_

#include "errnum.h"

#include <stddef.h>


typedef struct {

  /** add val to this collection and return index of entry */
  size_t (*add)(void *coll, int value, ErrNum *err);

  /** remove element at index from this collection and return
   *  value of removed entry.
   */
  int (*rm_at_index)(void *coll, size_t index, ErrNum *err);

  /** return # of entries in this collection */
  size_t (*size)(const void *coll);

  /**  call iterateFn() for each value in this collection */
  void (*iterate)(void *coll, void (*iterateFn)(int value, void *ctx),
                  void *ctx);

  /** free this collection result */
  void (*free)(void *coll);

} IntCollFns;

typedef struct {
  IntCollFns *fns;
} IntColl;

#endif // #ifndef INT_COLL_H_
