#include "linked-list.h"

#include "memalloc.h"

#include <ctype.h>
#include <stdlib.h>
#include <string.h>

//all routines terminate program on error


//.1.
//complete _LinkedList incomplete type
struct _LinkedList {
  LinkedList *next;
  char str[];  //flex array for NUL-terminated string chars
};

LinkedList *
make_linked_list(void)
{
  return callocChk(1, sizeof(LinkedList));
}

void
free_linked_list(LinkedList *listHdr)
{
  LinkedList *next;
  for (LinkedList *p = listHdr->next;
       p != NULL;
       p = next) {
    next = p->next; //copy p->next into p1 since
                  //p will become dangling ptr after free()
    free(p);
  }
  free(listHdr);
}
//.2.

/** copy NUL-terminated string from src to dest, converting it to
 *  lower-case.  Adds terminating NUL character to dest and return
 *  pointer to it.  Assumes that dest has space for at least
 *  strlen(src) + 1 chars.
 */
static char *
stpcpy_lc(char *dest, const char *src)
{
  char *destP = dest;
  for (const char *srcP = src; *srcP != '\0'; srcP++) {
    *destP++ = tolower(*srcP);
  }
  *destP = '\0';
  return destP;
}

/** insert lowercase(str) into list rooted at listHdr, keeping list
 *  sorted in strictly ascending order (hence str not inserted if
 *  already present).
 */
//.3.
void
insert_linked_list(LinkedList *listHdr, const char *str)
{
  //allocate storage for flexible array too
  //in single call to malloc().
  LinkedList *newNode =
    mallocChk(sizeof(LinkedList) + strlen(str) + 1);

  //lower-case copy, return '\0' ptr
  stpcpy_lc(newNode->str, str);

  LinkedList *previous;  //will insert after this
  LinkedList *current;   //will insert before this
  for (previous = listHdr, current = listHdr->next;
       current != NULL &&
         strcmp(current->str, newNode->str) < 0;
       previous = current,
         current = current->next) {
  }
  if (current != NULL && strcmp(current->str, newNode->str) == 0) {
    //str already in list, do not insert
    free(newNode);
  }
  else {
    //link in newNode between previous and current
    previous->next = newNode;
    newNode->next = current;
  }
}

//.4.
void
iterate_linked_list(const LinkedList *list,
                    IterateFn *fn, void *ctx)
{
  for (const LinkedList *p = list->next; p != NULL; p = p->next) {
    fn(p->str, ctx);
  }
}
