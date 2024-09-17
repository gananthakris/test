#include "shape.h"
#include "rect.h"

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct  {
  Rect;          //using -fms-extensions
  double width;
  double height;
} RectImpl;

static const char *
getKlass(const Shape *this)
{
  return "rectShape";
}

static double
area(const Shape *this)
{
  const RectImpl *rect = (const RectImpl *)this;
  return rect->width * rect->height;
}

static double
perimeter(const Shape *this)
{
  const RectImpl *rect = (const RectImpl *)this;
  return 2 * (rect->width + rect->height);
}

static double
width(const Rect *this)
{
  const RectImpl *rect = (const RectImpl *)this;
  return rect->width;
}

static double
height(const Rect *this)
{
  const RectImpl *rect = (const RectImpl *)this;
  return rect->height;
}

static _Bool isInit = false;
RectFns rectFns = {
  .area = area,
  .perimeter = perimeter,
  .getKlass = getKlass,
  .width = width,
  .height = height,
};

/** Return a new rect with specified radius.  Terminates program
 *  on error.
 */
Rect *
newRect(double w, double h)
{
  RectImpl *rect = malloc(sizeof(RectImpl));
  if (!rect) {
    fprintf(stderr, "newRect(): memory allocation failure\n");
    exit(1);
  }
  if (!isInit) {
    const ShapeFns *fns = getShapeFns();
    rectFns.areaPerimeterRatio = fns->areaPerimeterRatio;
    rectFns.free = fns->free;
    isInit = true;
  }
  rect->fns = &rectFns;
  rect->width = w; rect->height = h;
  return (Rect *)rect;
}
