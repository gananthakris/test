#ifndef _STACK_H
#define _STACK_H

typedef struct StackImpl Stack; /* incomplete struct */
typedef void *StackEntry;     /* generic entry */

Stack *new_stack(void);
void free_stack(Stack *s);
void push_stack(Stack *s, StackEntry e); /*  */
StackEntry pop_stack(Stack *s);
int size_stack(const Stack *s);

#endif /*ifndef _STACK_H */
