//data URL
const dataURL =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

//Vr: elements
const EL_G = "g";
const EL_H1 = "h1";
const EL_H2 = "h2";
const EL_RECT = "rect";
const EL_TEXT = "text";
const EL_TITLE = "title";
const EL_SVG = "svg";

//Vr: attributes
const A_HEIGHT = "height";
const A_ID = "id";
const A_TRANSFORM = "transform";
const A_URL = "url";
const A_VIEWBOX = "viewBox";
const A_WIDTH = "width";
const A_X = "x";
const A_Y = "y";
const A_DX = "dx";
const A_DY = "dy";
const A_MONTH = "data-month";
const A_YEAR = "data-year";
const A_TEMP = "data-temp";
const A_VAR = "data-variance";
const A_COLOR = "color";

//Vr: classes
const C_AX = "ax";
const C_CELL = "cell";
const C_LEGENDTEXT = "legend-text";

//Vr: Styles
const S_FILL = "fill";

//Vr: Request methods
const REQ_GET = "GET";

//Vr: Events
const MOUSE_OVER = "mouseover";
const MOUSE_OUT = "mouseout";

//Vr: D3 identifiers
const CLASS_CELL = ".cell";
const CLASS_TICK = ".tick";
const HEAD = "head";
const ID_APP = "#app";
const ID_CHART = "#chart";
const ID_LEGEND = "#legend";
const ID_TOOLTIP = "#tooltip";
const ID_YAXIS = "#y-axis";
const TEXT = "text";

//Vr: number constants
const innerXmin = 0;
const innerXmax = 250;
const innerYmin = 0;
const innerYmax = 100;
const xRange = [innerXmin, innerXmax];
const yRange = [innerYmin, innerYmax];
const xTicks = 20;
const tickSize = 1;
const yAxisHoriDisplacement = -1;
const yAxisVertDisplacement = -1;
const yAxTickDisplacement = 100 / 12;
const legendX = 25;
const legendY = 5;
const legendBoxWH = 4;
const legendBoxTextVertiSpacing = 3;
const legendBoxTextHoriSpacing = 6;
const legendItemHoriSpacing = 50;
const legendLineSpacing = 6;
const tooltipXdisplacement = 60;
const tooltipYdisplacement = -5;

//Vr: variables
let description = null;
let baseTemp = null;
let negativeMaxVar = null;
let positiveMaxVar = null;
let xDomain = null;
let yDomain = null;
let xScale = null;
let yScale = null;
let xAxis = null;
let yAxis = null;

//Vr: stringy constants
const title = "Global Temperature";
const legendTitle = "All temperatures (T) in degrees Celsius";
const year = "data-year";
const month = "data-month";
const temp = "data-temp";
const variance = "data-variance";
const color = "color";
const viewBoxChart = "-25 -10 300 130";
const viewBoxLegend = "0 0 300 50";
const zeroVariance = ["no variance", "green"];
const positiveRanges = [
  "0 < T < 0.5",
  "0.5 < T < 1.5",
  "1.5 < T < 2.5",
  "2.5 < T < 4.0",
  "4.0 < T < 6.0",
];
const negativeRanges = [
  "-0.5 < T < 0",
  "-1.5 < T < -0.5",
  "-2.5 < T < -1.5",
  "-4.0 < T < -2.5",
  "-7.0 < T < -4.0",
];
const positiveColors = ["#fff33b", "#fdc70c", "#f3903f", "#ed683c", "#e93e3a"];
const negativeColors = ["#daf0ff", "#85b5e2", "#3c88c1", "#1a6aa3", "#4e117d"];
const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
  "january",
];

//Fn: process data
const processData = (req) => {
  baseTemp = JSON.parse(req.response).baseTemperature;
  data = JSON.parse(req.response).monthlyVariance;
  xDomain = d3.extent(data.map((k) => k.year));
  yDomain = [0, 11];
  negativeMaxVar = d3.min(data.map((k) => k.variance));
  positiveMaxVar = d3.max(data.map((k) => k.variance));
  description = `Mean monthly variance on base temperature ${baseTemp}\u00B0C between ${d3.min(
    data.map((k) => k.year)
  )} and ${d3.max(data.map((k) => k.year))}`;
};

//Fn: get data
const getData = (URL) => {
  const req = new XMLHttpRequest();
  req.open(REQ_GET, URL, true);
  req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  req.onload = () => {
    processData(req);
    analyzeData();
    fireAll();
  };
  req.send(null);
};

//Fn: analyze, log data
const analyzeData = () => {
  console.log(data);
  console.log(
    `base: ${baseTemp}, maxminvar: ${negativeMaxVar}, maxposvar: ${positiveMaxVar}`
  );

  const allVariances = data.map((k) => k.variance);

  //positives
  const zeroVariance = allVariances.filter((k) => k === 0);
  const plusp5 = allVariances.filter((k) => k > 0 && k <= 0.5);
  const plusp5To1p5 = allVariances.filter((k) => k > 0.5 && k <= 1.5);
  const plus1p5To2p5 = allVariances.filter((k) => k > 1.5 && k <= 2.5);
  const plus2p5To4 = allVariances.filter((k) => k > 2.5 && k <= 4);
  const plus4To6 = allVariances.filter((k) => k > 4 && k <= 6);

  console.log("zero variance: " + zeroVariance.length);
  console.log("0.0 -> 0.5: " + plusp5.length);
  console.log("0.5 -> 1.5: " + plusp5To1p5.length);
  console.log("1.5 -> 2.5: " + plus1p5To2p5.length);
  console.log("2.5 -> 4.0: " + plus2p5To4.length);
  console.log("4.0 -> 6.0: " + plus4To6.length);

  //negatives
  const minusp5 = allVariances.filter((k) => k >= -0.5 && k < 0);
  const minusp5To1p5 = allVariances.filter((k) => k >= -1.5 && k < -0.5);
  const minus1p5To2p5 = allVariances.filter((k) => k >= -2.5 && k < -1.5);
  const minus2p5To4 = allVariances.filter((k) => k >= -4 && k < -2.5);
  const minus4To7 = allVariances.filter((k) => k >= -7 && k < -4);

  console.log("0.0 -> -0.5: " + minusp5.length);
  console.log("-0.5 -> -1.5: " + minusp5To1p5.length);
  console.log("-1.5 -> -2.5: " + minus1p5To2p5.length);
  console.log("-2.5 -> -4.0: " + minus2p5To4.length);
  console.log("-4.0 -> -7.0: " + minus4To7.length);

  console.log("total length: " + allVariances.length);
  console.log(
    "accumulated length: " +
      (zeroVariance.length +
        plusp5.length +
        plusp5To1p5.length +
        plus1p5To2p5.length +
        plus2p5To4.length +
        plus4To6.length +
        minusp5.length +
        minusp5To1p5.length +
        minus1p5To2p5.length +
        minus2p5To4.length +
        minus4To7.length)
  );
};

//Fn: insert titles, description
const inTitles = () => {
  d3.select(HEAD).append(EL_TITLE).text(title);
  d3.select(ID_APP).append(EL_H1).attr(A_ID, "title").text(title);
  d3.select(ID_APP).append(EL_H2).attr(A_ID, "description").text(description);
};

//Fn: create chart
const createChart = () => {
  d3.select(ID_APP)
    .append(EL_SVG)
    .attr(A_ID, "chart")
    .attr(A_VIEWBOX, viewBoxChart)
    .append(EL_TITLE)
    .text(title);
};

//Fn: define scales, axes
const defAxes = () => {
  xScale = d3.scaleLinear().domain(xDomain).range(xRange);
  xAxis = d3
    .axisBottom(xScale)
    .ticks(xTicks)
    .tickSize(tickSize)
    .tickFormat((d) => d);
  yScale = d3.scaleLinear().domain(yDomain).range(yRange);
  yAxis = d3
    .axisLeft(yScale)
    .tickSize(tickSize)
    .tickFormat((d) => months[d]);
};

//Fn: insert axes, displace y-axis, displace ticks
const inAxes = () => {
  d3.select(ID_CHART)
    .append(EL_G)
    .attr(A_ID, "x-axis")
    .classed(C_AX, true)
    .attr(A_TRANSFORM, `translate(0, ${innerYmax + innerYmax / 12})`)
    .call(xAxis);
  d3.select(ID_CHART)
    .append(EL_G)
    .attr(A_ID, "y-axis")
    .attr(
      A_TRANSFORM,
      `translate(${yAxisHoriDisplacement}, ${yAxisVertDisplacement})`
    )
    .classed(C_AX, true)
    .call(yAxis);
  d3.select(ID_YAXIS).selectAll(CLASS_TICK).attr(A_Y, yAxTickDisplacement);
};

//Fn: insert legend
const inLegend = () => {
  d3.select(ID_APP)
    .append(EL_SVG)
    .attr(A_ID, "legend-svg")
    .attr(A_VIEWBOX, viewBoxLegend)
    .append(EL_G)
    .attr(A_ID, "legend")
    .attr(A_TRANSFORM, `translate(${legendX}, ${legendY})`)
    .append(EL_TEXT)
    .attr(A_ID, "legend-title")
    .text(legendTitle);
  d3.select(ID_LEGEND)
    .append(EL_RECT)
    .attr(A_Y, legendLineSpacing)
    .attr(A_WIDTH, legendBoxWH)
    .attr(A_HEIGHT, legendBoxWH)
    .attr(S_FILL, zeroVariance[1]);
  d3.select(ID_LEGEND)
    .append(EL_TEXT)
    .classed(C_LEGENDTEXT, true)
    .attr(A_X, legendBoxTextHoriSpacing)
    .attr(A_Y, legendLineSpacing + legendBoxTextVertiSpacing)
    .text(zeroVariance[0]);
  for (let i = 0; i < 5; i++) {
    d3.select(ID_LEGEND)
      .append(EL_RECT)
      .attr(A_X, legendItemHoriSpacing * i)
      .attr(A_Y, legendLineSpacing * 2)
      .attr(A_WIDTH, legendBoxWH)
      .attr(A_HEIGHT, legendBoxWH)
      .attr(S_FILL, positiveColors[i]);
    d3.select(ID_LEGEND)
      .append(EL_TEXT)
      .classed(C_LEGENDTEXT, true)
      .attr(A_X, legendItemHoriSpacing * i + legendBoxTextHoriSpacing)
      .attr(A_Y, legendLineSpacing * 2 + legendBoxTextVertiSpacing)
      .text(positiveRanges[i]);
  }
  for (let i = 0; i < 5; i++) {
    d3.select(ID_LEGEND)
      .append(EL_RECT)
      .attr(A_X, legendItemHoriSpacing * i)
      .attr(A_Y, legendLineSpacing * 3)
      .attr(A_WIDTH, legendBoxWH)
      .attr(A_HEIGHT, legendBoxWH)
      .attr(S_FILL, negativeColors[i]);
    d3.select(ID_LEGEND)
      .append(EL_TEXT)
      .classed(C_LEGENDTEXT, true)
      .attr(A_X, legendItemHoriSpacing * i + legendBoxTextHoriSpacing)
      .attr(A_Y, legendLineSpacing * 3 + legendBoxTextVertiSpacing)
      .text(negativeRanges[i]);
  }
};

//Fn: insert Plots
const inPlots = () => {
  d3.select(ID_CHART)
    .selectAll(CLASS_CELL)
    .data(data)
    .enter()
    .append(EL_RECT)
    .classed(C_CELL, true)
    .attr(A_ID, (d) => `cell${d.month}${d.year}`)
    .attr(A_MONTH, (d) => d.month - 1)
    .attr(A_YEAR, (d) => d.year)
    .attr(A_VAR, (d) => d.variance)
    .attr(A_TEMP, (d) => baseTemp + d.variance)
    .attr(A_COLOR, (d) => {
      const v = d.variance;
      if (v === 0) {
        return zeroVariance[1];
      }
      if (v > 0 && v <= 0.5) {
        return positiveColors[0];
      }
      if (v > 0.5 && v <= 1.5) {
        return positiveColors[1];
      }
      if (v > 1.5 && v <= 2.5) {
        return positiveColors[2];
      }
      if (v > 2.5 && v <= 4) {
        return positiveColors[3];
      }
      if (v > 4 && v <= 6) {
        return positiveColors[4];
      }
      if (v >= -0.5 && v < 0) {
        return negativeColors[0];
      }
      if (v >= -1.5 && v < -0.5) {
        return negativeColors[1];
      }
      if (v >= -2.5 && v < -1.5) {
        return negativeColors[2];
      }
      if (v >= -4 && v < -2.5) {
        return negativeColors[3];
      }
      if (v >= -7 && v < -4) {
        return negativeColors[4];
      }
    })
    .attr(A_X, (d) => xScale(d.year))
    .attr(A_Y, (d) => yScale(d.month - 1))
    .attr(A_WIDTH, (innerXmax / data.length) * 12)
    .attr(A_HEIGHT, innerYmax / 12)
    .style(S_FILL, (d) => {
      const v = d.variance;
      if (v === 0) {
        return zeroVariance[1];
      }
      if (v > 0 && v <= 0.5) {
        return positiveColors[0];
      }
      if (v > 0.5 && v <= 1.5) {
        return positiveColors[1];
      }
      if (v > 1.5 && v <= 2.5) {
        return positiveColors[2];
      }
      if (v > 2.5 && v <= 4) {
        return positiveColors[3];
      }
      if (v > 4 && v <= 6) {
        return positiveColors[4];
      }
      if (v >= -0.5 && v < 0) {
        return negativeColors[0];
      }
      if (v >= -1.5 && v < -0.5) {
        return negativeColors[1];
      }
      if (v >= -2.5 && v < -1.5) {
        return negativeColors[2];
      }
      if (v >= -4 && v < -2.5) {
        return negativeColors[3];
      }
      if (v >= -7 && v < -4) {
        return negativeColors[4];
      }
    });
};

//Fn: highlight
const highlight = (id) => {
  d3.select(`#${id}`).style(S_FILL, "black");
};

//Fn: de-highlight
const deHighlight = (id, color) => {
  d3.select(`#${id}`).style(S_FILL, color);
};

//Fn: draw tooltip
const drawTooltip = (y, m, t, v) => {
  d3.select(ID_CHART)
    .append(EL_TEXT)
    .attr(A_ID, "tooltip")
    .attr(year, y)
    .attr(A_X, tooltipXdisplacement)
    .attr(A_Y, tooltipYdisplacement)
    .text(
      `${months[m]} ${y} --- T=${Number.parseFloat(t).toFixed(
        2
      )}\u00B0C --- var=${v}\u00B0C`
    );
};

//Fn: remove tooltip
const removeTooltip = () => {
  d3.select(ID_TOOLTIP).remove();
};

//Fn: add event listeners
const inEvents = () => {
  d3.selectAll(CLASS_CELL).on(MOUSE_OVER, (e) => {
    const id = e.target.id;
    const props = e.target.attributes;
    const y = props[year].nodeValue;
    const m = props[month].nodeValue;
    const t = props[temp].nodeValue;
    const v = props[variance].nodeValue;
    highlight(id);
    drawTooltip(y, m, t, v);
  });
  d3.selectAll(CLASS_CELL).on(MOUSE_OUT, (e) => {
    const id = e.target.id;
    const c = e.target.attributes[color].nodeValue;
    deHighlight(id, c);
    removeTooltip();
  });
};

//Fn: fire all d3 upon data load
const fireAll = () => {
  inTitles();
  createChart();
  defAxes();
  inAxes();
  inLegend();
  inPlots();
  inEvents();
};

getData(dataURL);
