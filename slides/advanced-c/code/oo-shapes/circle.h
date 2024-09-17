#ifndef _CIRCLE_H
#define _CIRCLE_H

#include "shape.h"

//forward reference
typedef struct CircleFns CircleFns;

typedef struct {
  CircleFns *fns;
} Circle;

struct CircleFns {
  ShapeFns;        //using -fms-extensions
  double (*radius)(const Circle *this);
};

/** Return a new circle with specified radius.  Terminates program
 *  on error.
 */
Circle *newCircle(double radius);

#endif //ifndef _CIRCLE_H
