

class AreaVis {

    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.displayData = [];
        this.parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

        // call method initVis
        this.initVis();
    };

// init AreaVis

    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 30, bottom: 80, left: 100};
        vis.width = .7 * ($("." + vis.parentElement).width() - vis.margin.left - vis.margin.right);
        vis.height = .7*($("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom);

        // SVG drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // clip path
        vis.svg.append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", vis.width)
            .attr("height", vis.height);

        // init scales
        vis.x = d3.scaleTime()
            .range([0, vis.width])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0])

        // init x & y axis
        vis.xAxis = vis.svg.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + vis.height + ")");
        vis.yAxis = vis.svg.append("g")
            .attr("class", "axis axis--y");

        // init pathGroup
        vis.pathGroup = vis.svg.append('g').attr('class', 'pathGroup')


        // init path
        vis.path = vis.pathGroup
            .append('path')
            .attr("class", "area");

        // SVG area path generator
        vis.area = d3.area()
            .x(d => vis.x(d.date))
            .y1(d => vis.y(d.reviews))
            .y0(vis.height)

        // tooltip init
        vis.tooltip = vis.svg.append("g")
            .attr("class", "tooltip-1")
            .style("display", "none");

        // init basic data processing
        this.wrangleData();
    };

// wrangleData
    wrangleData() {
        let vis = this;


        // iterate over each year
        vis.data.forEach(function (d) {
            let row = {
                date: vis.parseDate(d['date']),
                reviews: d["index1"]}
            vis.displayData.push(row)})

        // Update the visualization
        this.updateVis();
    };

    updateVis() {
        let vis = this;

        vis.x.domain(d3.extent(vis.displayData, d => d.date))
        vis.y.domain(d3.extent(vis.displayData, d => d.reviews))

        // draw x & y axis
        vis.xAxis
            .call(d3.axisBottom(vis.x));

        vis.yAxis.call(d3.axisLeft(vis.y).ticks(5));


        vis.path
            .datum(vis.displayData)
            .style("fill", "#d32323")
            .attr("d", d => vis.area(d))
            .attr("stroke", "black")
            .attr("clip-path", "url(#clip)")

        vis.line = vis.tooltip.append("line")
            .attr("stroke", "black")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", vis.height);


        // tooltip behavior for mouseover

        vis.svg
            .on('mouseover', function(event, d){
                // unhide tooltip
                d3.select(".tooltip-1").style("display", "block")
            })
            .on('mousemove', function(event, d){

                // get info about where the user is hovering
                let xPosition = d3.pointer(event)[0];
                let bisectDate = d3.bisector(d=>d.date).left;
                let mouseDate = vis.x.invert(xPosition);
                let toolTipIndex = bisectDate(vis.displayData, mouseDate)
                let dateFormat = d3.timeFormat("%Y-%m-%d")
                let numberReviews = vis.displayData[toolTipIndex].reviews

                // update tooltip line
                vis.line
                    .attr("x1", xPosition)
                    .attr("x2", xPosition)
                    .attr("y1", vis.y(numberReviews))

                // update tooltip text
                document.getElementById('name').textContent = "Date: " + (dateFormat((vis.displayData[toolTipIndex].date)));
                document.getElementById('city').textContent = "Reviews: " + numberReviews
            })
            .on('mouseout', function(event,d){
                // hide tooltip
                d3.select(".tooltip-1").style("display", "none")

                // reset tooltip text
                document.getElementById('name').textContent = "";
                document.getElementById('city').textContent = "";
            });


    }

}