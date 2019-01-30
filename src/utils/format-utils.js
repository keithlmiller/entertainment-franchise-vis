import * as d3 from 'd3';

export const truncate = (string, length = 10) => {
    return string.substring(0, length);
}


// from Mike Bostok https://bl.ocks.org/mbostock/7555321
export const wrap = (text, width) => {
    text.each(() => {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('dy').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'dy').text(word);
        }
      }
    });
  }