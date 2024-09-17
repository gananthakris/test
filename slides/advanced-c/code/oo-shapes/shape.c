#include "shape.h"

#include <stdlib.h>

static double
areaPerimeterRatio(const Shape *this)
{
  double area = this->fns->area(this);
  double perimeter = this->fns->perimeter(this);
  return area/perimeter;
}

static void
freeShape(Shape *this)
{
  free(this);
}

static ShapeFns shapeFns = {
  .areaPerimeterRatio = areaPerimeterRatio,
  .free = freeShape
};

ShapeFns *
getShapeFns(void)
{
  return &shapeFns;
}
