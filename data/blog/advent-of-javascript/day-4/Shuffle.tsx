import Script from 'next/script'

export function Shuffle() {
  return (
    <div id="shuffle">
      <Script src="https://d3js.org/d3.v2.min.js" />
      <style>{`
        line {
          stroke: #000;
          stroke-width: 1.5px;
        }

        line.conflict {
          stroke: red !important;
          stroke-width: 4px !important;
        }

        .play path {
          stroke: #fff;
          stroke-width: 6px;
        }

        .play:hover path {
          fill: red;
        }

        .play rect {
          fill: none;
          pointer-events: all;
          cursor: pointer;
        }
      `}</style>
      <Script strategy="lazyOnload">{`
        var margin = {top: 0, right: 24, bottom: 0, left: 24},
            width = 480,
            height = 80 - margin.top - margin.bottom,
            size = height * .4;

        var n = 200;

        var x = d3.scale.ordinal()
            .domain(d3.range(n))
            .rangePoints([0, width]);

        var y = d3.scale.linear()
            .domain([0, n - 1])
            .range([-Math.PI / 4, Math.PI / 4]);

        function chart(update) {
          var m = 200;

          var svg = d3.select("#shuffle").append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .style("margin-left", "auto")
              .style("margin-right", "auto")
              .style("margin-bottom", "2rem")
            .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

          var line = svg.selectAll("line")
              .data(d3.range(n))
            .enter().append("line")
              .attr("x2", function(d) { return size * Math.sin(y(d)); })
              .attr("y2", function(d) { return -size * Math.cos(y(d)); })
              .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; })
              .style("stroke", "blue");

          var play = svg.append("g")
              .attr("class", "play")
              .on("click", start);

          play.append("path")
              .attr("d", "M-30,-30L30,0L-30,30Z")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(.6)");

          play.append("rect")
              .attr("width", width)
              .attr("height", height);

          function start() {
            play.style("display", "none");
            var interval = setInterval(function() {
              if (!(m = update(line, m))) {
                m = n;
                clearInterval(interval);
                setTimeout(function() {
                  play.style("display", null);
                  line = svg.selectAll("line")
                      .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; })
                      .style("stroke", "blue");
                }, 5000);
              }
            }, 50);
          }

          return svg;
        }

        chart(function(line, m) {
          var i = ~~(Math.random() * m--),
              a = line[0][i],
              b = line[0][m];

          d3.select(line[0][i] = b).transition()
              .duration(750)
              .attr("transform", "translate(" + x(i) + "," + height + ")");

          d3.select(line[0][m] = a)
              .style("stroke", "#d946ef")
              .style("stroke-width", "4px")
            .transition()
              .duration(750)
              .attr("transform", "translate(" + x(m) + "," + height + ")")
              .style("stroke-width", "1.5px");

          return m;
        });
      `}</Script>
    </div>
  )
}
