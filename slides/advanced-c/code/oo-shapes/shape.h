#ifndef _SHAPE_H
#define _SHAPE_H

//forward reference
typedef struct ShapeFns ShapeFns;

//A shape always has a fns field as its initial member.  This is captured in
//the abstract struct shape.
typedef struct Shape {
  ShapeFns *fns;
} Shape;

/** Return functions for an abstract shape. */
ShapeFns *getShapeFns(void);

struct ShapeFns {

  /** Return name of implementing class for this shape. */
  const char *(*getKlass)(const Shape *this);

  /** Free all resources used by this shape which becomes invalid after
   *  calling this function.
   */
  void (*free)(Shape *this);


  /** Return the area of this shape. */
  double (*area)(const Shape *this);

  /** Return the perimeter of this shape. */
  double (*perimeter)(const Shape *this);

  /** Return the ratio of area to perimeter of this shape */
  double (*areaPerimeterRatio)(const Shape *this);
};

#endif //ifndef _SHAPE_H
