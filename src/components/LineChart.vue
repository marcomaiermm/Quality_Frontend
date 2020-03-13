<template>
    <div class="chart">
    </div>
</template>

<script>
import { select } from 'd3-selection'
import * as d3 from 'd3'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters('dataset', ['parsedData'])
  },
  methods: {
    renderChart () {
      console.log()
      var data = this.parsedData
      var margin = { top: 20, right: 20, bottom: 30, left: 50 }
      var width = this.width - margin.left - margin.right
      var height = this.height - margin.top - margin.bottom
      var parseTime = d3.timeParse('%d.%m.%Y')

      var x = d3.scaleTime().range([0, width])
      var y = d3.scaleLinear().range([height, 0])

      // define the area
      var area = d3.area()
        .x(function (d) { return x(d.Date) })
        .y0(height)
        .y1(function (d) { return y(d.Close) })

      var valueLine = d3.line()
        .x(function (d) { return x(d.Date) })
        .y(function (d) { return y(d.Close) })

      var svg = select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')')

      data.forEach(function (d) {
        d.Date = parseTime(d.Date)
        d.Close = +d.Close
      })

      x.domain(d3.extent(data, function (d) { return d.Date }))
      y.domain([0, d3.max(data, function (d) { return d.Close })])

      // add the area
      svg.append('path')
        .data([data])
        .attr('class', 'area')
        .attr('d', area)

      // add the valueline path.
      svg.append('path')
        .data([data])
        .attr('class', 'line')
        .attr('d', valueLine)

      // add the X Axis
      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))
        // add the Y Axis

      svg.append('g')
        .call(d3.axisLeft(y))
    }
  }
}
</script>
