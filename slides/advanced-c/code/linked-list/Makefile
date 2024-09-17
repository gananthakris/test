COURSE = cs551

TARGET = linked-list

INCLUDE_DIR = $(HOME)/$(COURSE)/include
LIB_DIR = $(HOME)/$(COURSE)/lib

CC = gcc

CFLAGS = -g -Wall -std=gnu17 -I$(INCLUDE_DIR) $(MAIN_BUILD_FLAG)
LDFLAGS = -L $(LIB_DIR) -Wl,-rpath=$(LIB_DIR)
LDLIBS = -lcs551

OFILES = \
  linked-list.o \
  main.o


$(TARGET):	$(OFILES)
		$(CC)  $(LDFLAGS) $(OFILES)  $(LDLIBS) -o $@


.PHONY:		clean
clean:
		rm -rf *~ *.o $(TARGET) $(DEPDIR)

linked-list.o:  linked-list.c linked-list.h
main.o:  main.c linked-list.h
