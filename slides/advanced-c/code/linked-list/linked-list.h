#ifndef LINKED_LIST_H_
#define LINKED_LIST_H_

//incomplete declaration
typedef struct _LinkedList LinkedList;

//all routines terminate program on error

LinkedList *make_linked_list(void);

void free_linked_list(LinkedList *list);

/** insert lowercase(str) into list, keeping list sorted in
 *  strictly ascending order (hence str not inserted if
 *  already present).
 */
void insert_linked_list(LinkedList *list, const char *str);

typedef void IterateFn(const char *str, void *ctx);

void iterate_linked_list(const LinkedList *list,
                         IterateFn *fn, void *ctx);

#endif //#ifndef LINKED_LIST_H_
