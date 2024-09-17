CC = gcc
CFLAGS = -O2 -Wall

TARGET = c-demo

$(TARGET):	main.o f1.o f2.o
		$(CC) $? -o $@

%.s:		%.c
		$(CC) $(CFLAGS) -S $<

.PHONY:		clean
clean:
		rm -f *.o *~ $(TARGET)

