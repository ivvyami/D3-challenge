// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create SVG wrapper, and append an SVG group that will hold all components
// of our chart together

var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data!
d3.csv("../assets/data/data.csv").then(function(stateData) {

    // step 1: parse data/cast as numbers when needed
    stateData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = data.healthcareHigh;

    });

    //step 2: create scale functions

    var xLinearScale = d3.scaleLinear()
      .domain([10 -2, d3.max(stateData, d => d.poverty)])
      .range([5, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(stateData, d => d.healthcare)])
        .range([height, 0]);

    
    //step 3: create axis function 

    var bottomAxis = d3.axisBottom(xLinearScale); 
    var leftAxis = d3.axisLeft(yLinearScale); 

    //step 4: append axes to the chart
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis); 

    chartGroup.append("g")
        .call(leftAxis);

    //step 5: create circles with state abbreviations in them
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", "8")
        .attr("fill", "blue")
        .attr("opacity", ".5");

    
    circlesGroup.selectAll()
        .data(stateData)
        .enter()
        .append("text")
        .text(d => d.abbr)
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("font-size", "15px")
        .attr("fill", "black");

        //step 6: create axes labels

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height/2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)"); 
        
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)"); 
}).catch(function(error){
    console.log(error);
});