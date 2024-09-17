#use -std=gnu11 instead of c11 to obtain math.h constants like M_PI
CFLAGS = -g -Wall -fms-extensions -std=gnu11

OBJS = \
  circle.o \
  main.o \
  shape.o \
  rect.o

TARGET = shapes

$(TARGET):	$(OBJS)
		$(CC) $(OBJS) -o $@

clean:
		rm -f *.o $(TARGET)

depends:
		$(CC) $(CFLAGS) -MM *.c

#produced using make depends
circle.o: circle.c shape.h circle.h
main.o: main.c circle.h shape.h rect.h
rect.o: rect.c shape.h rect.h
shape.o: shape.c shape.h


