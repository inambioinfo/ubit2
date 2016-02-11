function initQC() {
    var t1 = document.getElementById('percentage_success_per_gene_threshold_slider').value/100;
    var t2 = document.getElementById('percentage_genes_detected_per_sample_slider').value/100;
    drawHistSuccessGenes(successPerGenes, t1);
    drawBarplotSuccessGenes(successPerGenes, t1);
    drawHistGenesDetected(genesDetectedPerSample, t2);
    drawBarplotGenesDetected(genesDetectedPerSample, t2);
}

function drawHistSuccessGenes(data, threshold) {
    var mat = data.map(function(d) { return d.value });
    
    var g = document.getElementById('hist_percentage_success_per_gene'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;
    
    var margin = {top: 5, right: 35, bottom: 50, left: 10},
	width = windowWidth - margin.left - margin.right,
	height = windowHeight - margin.top - margin.bottom;

    // remove if already existing for regeneration
    d3.select("#hist_percentage_success_per_gene_svg").remove();
    
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(mat.length/5))
    (mat);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.y;
	})   

    var svg = d3.select("#hist_percentage_success_per_gene").append("svg")
	.attr("id","hist_percentage_success_per_gene_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var bar = svg.selectAll(".bar")
        .data(data)
	.enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; })
        .style("fill", function(d) {
	    if (d.x < threshold) {return "red"}
	    else { return "steelblue" }
	})    

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); })
	.on('mouseover', tip.show)
        .on('mouseout', tip.hide);
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("line")
        .attr("x1", x(threshold))
        .attr("y1", 0)
        .attr("x2", x(threshold))
        .attr("y2", height)
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5")
        .style("stroke", "red")
        .style("fill", "none");

}

function drawHistGenesDetected(data, threshold) {
    var mat = data.map(function(d) { return d.value });

    var g = document.getElementById('hist_percentage_genes_detected_per_sample'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;
    
    var margin = {top: 5, right: 35, bottom: 50, left: 10},
	width = windowWidth - margin.left - margin.right,
	height = windowHeight - margin.top - margin.bottom;

    // remove if already existing for regeneration
    d3.select("#hist_percentage_genes_detected_per_sample_svg").remove();
    
    var x = d3.scale.linear()
        .domain([0, 1])
        .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(mat.length/5))
    (mat);

    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.y; })])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.y;
	})   

    var svg = d3.select("#hist_percentage_genes_detected_per_sample").append("svg")
	.attr("id","hist_percentage_genes_detected_per_sample_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    var bar = svg.selectAll(".bar")
        .data(data)
	.enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(data[0].dx) - 1)
        .attr("height", function(d) { return height - y(d.y); })
	.on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .style("fill", function(d) {
	    if (d.x < threshold) {return "red"}
	    else { return "steelblue" }
	})
    
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("line")
        .attr("x1", x(threshold))
        .attr("y1", 0)
        .attr("x2", x(threshold))
        .attr("y2", height)
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5")
        .style("stroke", "red")
        .style("fill", "none");

}

function drawBarplotSuccessGenes(data, threshold) {    
    var g = document.getElementById('barplot_percentage_success_per_gene'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;

    var margin = {top: 15, right: 30, bottom: 50, left: 30},
	width = windowWidth - margin.left - margin.right,
	height = windowHeight - margin.top - margin.bottom;

    // remove if already existing for regeneration
    d3.select("#barplot_percentage_success_per_gene_svg").remove();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
	.domain(data.map(function(d) { return d.name; }));
    
    var y = d3.scale.linear()
        .range([height, 0])
	.domain([0, 1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
	.ticks(5);
        
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.name;
	})   

    var svg = d3.select("#barplot_percentage_success_per_gene").append("svg")
	.attr("id","barplot_percentage_success_per_gene_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) {
	    if (d.value < threshold) {return "red"}
	    else { return "steelblue" }
	})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    /*
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    */
    svg.append("line")
        .attr("y1", y(threshold))
        .attr("x1", 0)
        .attr("y2", y(threshold))
        .attr("x2", width)
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5")
        .style("stroke", "red")
        .style("fill", "none");
}

function drawBarplotGenesDetected(data, threshold) {
    var g = document.getElementById('barplot_percentage_genes_detected_per_sample'),
	windowWidth = g.clientWidth,
	windowHeight = g.clientHeight;

    var margin = {top: 15, right: 30, bottom: 50, left: 30},
	width = windowWidth - margin.left - margin.right,
	height = windowHeight - margin.top - margin.bottom;

    // remove if already existing for regeneration
    d3.select("#barplot_percentage_genes_detected_per_sample_svg").remove();

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
	.domain(data.map(function(d) { return d.name; }));
    
    var y = d3.scale.linear()
        .range([height, 0])
	.domain([0, 1]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
	.ticks(5);
        
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-1, 0])
        .html(function(d) {
	    return d.name;
	})   

    var svg = d3.select("#barplot_percentage_genes_detected_per_sample").append("svg")
	.attr("id","barplot_percentage_genes_detected_per_sample_svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) {
	    if (d.value < threshold) {return "red"}
	    else { return "steelblue" }
	})
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide);


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

    /*
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    */
    svg.append("line")
        .attr("y1", y(threshold))
        .attr("x1", 0)
        .attr("y2", y(threshold))
        .attr("x2", width)
        .style("stroke-width", 1)
        .style("stroke-dasharray", "5,5")
        .style("stroke", "red")
        .style("fill", "none");
}