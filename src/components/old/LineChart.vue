<template>
  <div class="q-pa-md">
    <q-card class="line-card" bordered>
      <q-card-section>
        <div class="text-overline text-9">
          Line Chart
        </div>
        <div class="text-subtitle1 q-mt-sm q-mb-xs">
          Close Price
        </div>
        <!--<div class="text-caption text-grey"></div>
        <svg
          :height="height"
          :width="width"
        >
        </svg>
        <svg
        class="chart"
        :width="width"
        :height="height"
        >
          <g transform="translate(50,50)">
          </g>
        </svg>-->
        <!--<svg id="chart-visualisation"></svg>-->
        <commit-chart
          :width="w"
          :height="h"
          :chartData="datacollection"
          :options="options"
        >
        </commit-chart>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import CommitChart from "./js/CommitChart.js";
// import { select } from 'd3-selection'
// import * as d3 from 'd3'
import { mapGetters } from "vuex";

var moment = require("moment");

export default {
  name: "LineChart",
  components: {
    CommitChart
  },
  computed: {
    ...mapGetters({ Data: "dataset/getData" })
  },
  data() {
    return {
      datacollection: null,
      dataset: {},
      options: {},
      h: 400,
      w: 1000
      // margin: { top: 30, right: 20, bottom: 30, left: 50 }
    };
  },
  watch: {
    Data: function(newData, oldData) {
      console.log("Watcher executed");
      this.dataset = [];
      newData.forEach(element => {
        this.dataset.push({ ...element });
      });
      this.fillData();
    }
  },
  methods: {
    fillData() {
      this.datacollection = {
        labels: this.Data.map(function(d) {
          return moment(d.Datum, "DD-MM-YYYY");
        }),
        datasets: [
          {
            label: "Close",
            pointHoverBackgroundColor: "rgba(0, 119, 220, 0.6)",
            borderColor: "rgba(2, 62, 115, 0.8)",
            backgroundColor: "rgba(2, 62, 115, 0.1)",
            borderWidth: 1,
            pointHoverRadius: 5,
            pointRadius: 2,
            lineTension: 0,
            fill: true,
            data: this.Data.map(function(d) {
              return d.Close;
            })
          }
        ]
      };
      this.options = {
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  day: "DD.MM.YY",
                  month: "DD.MM.YY",
                  year: "DD.MM.YY"
                }
              },
              ticks: {
                // autoSkip: true,
                maxTicksLimit: 14.1
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ]
        },
        plugins: {
          zoom: {
            zoom: {
              enabled: true,
              mode: "xy"
            },
            pan: {
              enabled: true,
              mode: "xy"
            }
          }
        }
      };
    }
    /*
    renderLineChart () {
      // Set the dimensions of the canvas / graph
      var width = this.width - this.margin.left - this.margin.right
      var height = this.height - this.margin.top - this.margin.bottom

      // var parseTime = d3.timeParse('%d.%m.%Y')

      var x = d3.scaleTime().range([0, width])
      var y = d3.scaleLinear().range([height, 0])

      // define the line
      this.valueline = d3.line()
        .x(function (d) { return x(d.Date) })
        .y(function (d) { return y(d.Close) })

      d3.selectAll('g').remove()
      // append the svg obgect to the body of the page
      // appends a 'group' element to 'svg'
      // moves the 'group' element to the top left margin

      var svg = d3.selectAll('#chart-visualisation')
        .attr('width', width + this.margin.left + this.margin.right)
        .attr('height', height + this.margin.top + this.margin.bottom)

      var g = svg.append('g')
        .attr('transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')')

      var div = d3.select('chart-visualisation').append('div')
        .attr('class', 'tooltip-chart')
        .style('opacity', 0)

      x.domain(this.Data.map(function (d) { return d.Date }))
      y.domain(this.Data.map(function (d) { return d.Close }))

      // scale the range of the data
      x.domain(d3.extent(this.Data, function (d) { return d.Date }))
      y.domain([0, d3.max(this.Data, function (d) { return d.Close })])

      // add the valueline path.
      g.append('path')
        .data([this.Data])
        .attr('class', 'line')
        .attr('d', this.valueline)
        .on('mouseover', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '.85')

          div.transition()
            .duration(50)
            .style('opacity', 1)
          div.html(d.Close)
            .style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 15) + 'px')
        })
        .on('mouseout', function (d, i) {
          d3.select(this).transition()
            .duration('50')
            .attr('opacity', '1')

          div.transition()
            .duration(50)
            .style('opacity', 0)
        })
      var totalLength = g.select('.line').node().getTotalLength()

      g.select('.line')
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition() // Call Transition Method
        .duration(500) // Set Duration timing (ms)
        .ease(d3.easeLinear) // Set Easing option
        .attr('stroke-dashoffset', 0)
      // add the X Axis
      g.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // add the Y Axis
      g.append('g')
        .call(d3.axisLeft(y))
    }
  */
  },
  mounted() {
    this.fillData();
  }
};
</script>

<style lang="sass">
.line-card
  width: 100%
  max-width: 1000px
.line
  fill: none
  stroke: steelblue
  stroke-width: 2px
.small
  max-width: 600px
  margin: 15px auto
</style>
