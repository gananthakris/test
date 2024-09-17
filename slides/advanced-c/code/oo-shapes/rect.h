#ifndef _RECT_H
#define _RECT_H

#include "shape.h"

//forward reference
typedef struct RectFns RectFns;

typedef struct {
  RectFns *fns;
} Rect;

struct RectFns {
  ShapeFns;       //using -fms-extensions
  double (*width)(const Rect *this);
  double (*height)(const Rect *this);
};


/** Return a new rect with specified radius.  Terminates program
 *  on error.
 */
Rect *newRect(double width, double height);

#endif //ifndef _RECT_H
