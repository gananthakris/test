COURSE = cs551

TARGET = sort-ints

INCLUDE_DIR = $(HOME)/$(COURSE)/include
LIB_DIR = $(HOME)/$(COURSE)/lib

CC = gcc

CFLAGS = -g -Wall -std=c17 -I$(INCLUDE_DIR) $(MAIN_BUILD_FLAG)
LDFLAGS = -L $(LIB_DIR) -Wl,-rpath=$(LIB_DIR)
LDLIBS = -lcs551

MAIN_BUILD_FLAG = -DTEST_SORTED_COLL
#MAIN_BUILD_FLAG = -DTEST_SORTED_INT_LIST
#MAIN_BUILD_FLAG = -DTEST_SORTED_INT_VEC
#MAIN_BUILD_FLAG = -DTEST_COLL_PERF


#produce a list of all cc files
C_FILES = $(wildcard *.c)

#produce a list of all *.o files by substituting c in C_FILES with o.
OFILES = $(C_FILES:%.c=%.o)

#default target
all:		$(TARGET)

$(TARGET):	$(OFILES)
		$(CC)  $(LDFLAGS) $(OFILES)  $(LDLIBS) -o $@


.PHONY:		clean
clean:
		rm -rf *~ *.o $(TARGET) $(DEPDIR)

coll-perf.dat:	$(TARGET)
		./$< `seq 10000 10000 100000` > $@
coll-perf.png:	coll-perf.dat coll-perf.gp
		gnuplot coll-perf.gp

#auto-dependences
#<http://make.mad-scientist.net/papers/advanced-auto-dependency-generation/>

#dir in which to generate dependences
DEPDIR = .deps

#have DEPDIR/*.d file for each *.c file
DEPFILES = $(C_FILES:%.c=$(DEPDIR)/%.d)

#-MT $@ sets target name in dependency file
#-MMD tells compiler to generate prereqs without including system headers
#-MP adds target for each prereq
#-MF $(DEPDIR)/$*.d sets name of output dependency file
DEPFLAGS = -MT $@ -MMD -MP -MF $(DEPDIR)/$*.d

#delete built-in implicit rule for building .o from .c
%.o: %.c

#create our own implicit rule for building %.o from %.c
#| $(DEPDIR) makes DEPDIR an order only prereq
%.o:		%.c $(DEPDIR)/%.d | $(DEPDIR)
		$(CC) $(DEPFLAGS) $(CFLAGS) -c $<

#create DEPDIR if it does not exist
$(DEPDIR):
		@mkdir -p $@

#add a target to include all DEPFILES
$(DEPFILES):
include $(wildcard $(DEPFILES))

