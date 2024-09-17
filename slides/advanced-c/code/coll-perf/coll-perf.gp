set term png
set output "coll-perf.png"
set xlabel "N"
set ylabel "Time (ms)"
set colorsequence podo
set termoption linewidth 3.5
plot "coll-perf.data" using 1:2 with linespoints title 'List', \
     "coll-perf.data"   using 1:3 with linespoints title 'Vec'