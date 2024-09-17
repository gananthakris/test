#include "shape.h"
#include "circle.h"

#include <math.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct {
  Circle;        //using -fms-extensions
  double radius;
} CircleImpl;

static const char *
getKlass(const Shape *this)
{
  return "circleShape";
}

static double
area(const Shape *this)
{
  const CircleImpl *circle = (const CircleImpl *)this;
  return M_PI * circle->radius * circle->radius;
}

static double
perimeter(const Shape *this)
{
  const CircleImpl *circle = (const CircleImpl *)this;
  return 2 * M_PI * circle->radius;
}

static double
radius(const Circle *this)
{
  const CircleImpl *circle = (const CircleImpl *)this;
  return circle->radius;
}

static _Bool isInit = false;
CircleFns circleFns = {
  .area = area,
  .perimeter = perimeter,
  .getKlass = getKlass,
  .radius = radius,
};

/** Return a new circle with specified radius.  Terminates program
 *  on error.
 */
Circle *
newCircle(double r)
{
  CircleImpl *circle = malloc(sizeof(CircleImpl));
  if (!circle) {
    fprintf(stderr, "newCircle(): memory allocation failure\n");
    exit(1);
  }
  if (!isInit) {
    const ShapeFns *fns = getShapeFns();
    circleFns.areaPerimeterRatio = fns->areaPerimeterRatio;
    circleFns.free = fns->free;
    isInit = true;
  }
  circle->fns = &circleFns;
  circle->radius = r;
  return (Circle *)circle;
}
