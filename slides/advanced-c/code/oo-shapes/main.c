#include "circle.h"
#include "rect.h"
#include "shape.h"

#include <stdio.h>

int
main(void)
{
  const Circle *circle1 = newCircle(1);
  printf("created circle1 = circle(radius = %g)\n",
         circle1->fns->radius(circle1));
  const Rect *rect1 = newRect(1, 1);
  printf("created rect1 = rect(width = %g, height = %g)\n",
         rect1->fns->width(rect1), rect1->fns->height(rect1));
  const Shape *shapes[] = {
    (const Shape *)circle1,
    (const Shape *)rect1,
  };
  for (int i = 0; i < sizeof(shapes)/sizeof(shapes[0]); i++) {
    const Shape *shape = shapes[i];
    printf("%d: klass = %s; area = %g; perimeter = %g; ratio = %g\n",
           i,
           shape->fns->getKlass(shape),
           shape->fns->area(shape),
           shape->fns->perimeter(shape),
           shape->fns->areaPerimeterRatio(shape));
    shape->fns->free((Shape *)shape);
  }
}
