CC = gcc
CFLAGS = -g -Wall -std=c99
#CPPFLAGS=	-I$(HOME)/$(COURSE)/include
#LDFLAGS=	-L$$HOME/$(COURSE)/lib -l$(COURSE)

OBJS = \
  main.o \
  stack.o

TARGETS = \
  stack

all: 		$(TARGETS)

stack:		$(OBJS)
		$(CC) $(OBJS) $(LDFLAGS) -o $@


#Removes all objects and executables.
clean:
		rm -f $(OBJS) $(TARGET) *test *~

