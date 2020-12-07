class ParallelChart {

    // constructor method to initialize Timeline object
    constructor(parentElement, businessData) {
        this.parentElement = parentElement;
        this.data = businessData;
        this.displayData = [];

        this.initVis()

    }

    initVis() {

        let vis = this;
        vis.margin = {top: 20, right: 30, bottom: 80, left: 30};
        vis.width = $("." + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Color scale: give me a specie name, I return a color
        vis.color = d3.scaleOrdinal()
            .domain(["French", "American (Traditional)", "American (New)", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican", "Fast Food", "Greek", "Ethnic Food", "Other"])
            .range(["#ee4035", "#f37736", "#fdf498", "#7bc043", "#0392cf", "#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b", "#008744", "#0057e7", "#d62d20"])

        // Here I set the list of dimension manually to control the order of axis:
        vis.dimensions = ["cuisine", "outdoorSeating", "priceRange", "hasTV", "stars"]

        vis.wrangleData();
    }
    wrangleData () {
        let vis = this;

        vis.displayData = [];

        console.log(vis.data);

        vis.data.forEach(function(restaurant) {

            if (restaurant.city == selectedScatterCategory && restaurant.review_count > 20) {
                vis.displayData.push(
                    {
                        cuisine: restaurant.categories[0],
                        outdoorSeating: restaurant.attributes.OutdoorSeating,
                        priceRange: restaurant.attributes.RestaurantsPriceRange2,
                        hasTV: restaurant.attributes.HasTV,
                        stars: restaurant.stars

                    })
            }
        });

        vis.updateVis();

    }
    updateVis() {
        let vis = this;

        // For each dimension, I build a categorical scale. I store all in a y object
        vis.y = {}
        vis.dimensions.forEach(function (i) {

            vis[i] = d3.scaleBand()
                .domain(vis.displayData.map(d => d[i])) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([vis.height, 0])
        })
        console.log(vis.y);

        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width])
            .domain(vis.dimensions);

        // Highlight the specie that is hovered
        vis.highlight = function(d){

            vis.selected_specie = d.cuisine

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + vis.selected_specie)
                .transition().duration(200)
                .style("stroke", vis.color(vis.selected_specie))
                .style("opacity", "1")
        }

        // Unhighlight
        vis.doNotHighlight = function(d){
            d3.selectAll(".line")
                .transition().duration(200).delay(1000)
                .style("stroke", function(d){ return( vis.color(d.cuisine))} )
                .style("opacity", "1")
        }



        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(vis.dimensions.map(function (p) {
                let hold = d[p];
                let scale = vis[p];
                console.log(scale(hold));
                return [vis.x(p), scale(hold)];
            }));
        }

        // Draw the lines
        vis.svg
            .selectAll("myPath")
            .data(vis.displayData)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "line " + d.cuisine
            }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (vis.color(d.cuisine))
            })
            .style("opacity", 0.5)
            .on("mouseover", vis.highlight)
            .on("mouseleave", vis.doNotHighlight)



        // Draw the axis:
        vis.svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(vis.dimensions).enter()
            .append("g")
            .attr("class", "axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + vis.x(d) + ")";
            })
            // And I build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(vis[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")


    }

}




class ParallelChart {

    // constructor method to initialize Timeline object
    constructor(parentElement, businessData) {
        this.parentElement = parentElement;
        this.data = businessData;
        this.displayData = [];

        this.initVis()

    }

    initVis() {

        let vis = this;
        vis.margin = {top: 20, right: 30, bottom: 80, left: 30};
        vis.width = $("." + vis.parentElement).width() - vis.margin.left - vis.margin.right;
        vis.height = $("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom;

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Color scale: give me a specie name, I return a color
        vis.color = d3.scaleOrdinal()
            .domain(["French", "American (Traditional)", "American (New)", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican", "Fast Food", "Greek", "Ethnic Food", "Other"])
            .range(["#ee4035", "#f37736", "#fdf498", "#7bc043", "#0392cf", "#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b", "#008744", "#0057e7", "#d62d20"])

        // Here I set the list of dimension manually to control the order of axis:
        vis.dimensions = ["checkIns", "priceRange", "is_open", "review_count", "stars"]

        vis.wrangleData();
    }
    wrangleData () {
        let vis = this;

        vis.displayData = [];

        console.log(vis.data);

        vis.data.forEach(function(restaurant) {

            if (restaurant.city == selectedScatterCategory && restaurant.review_count > 20) {
                vis.displayData.push(
                    {
                        cuisine: restaurant.categories[0],
                        checkIns: restaurant.checkIns,
                        priceRange: +restaurant.attributes.RestaurantsPriceRange2,
                        is_open: restaurant.is_open,
                        review_count: restaurant.review_count,
                        stars: restaurant.stars

                    })
            }
        });

        vis.updateVis();

    }
    updateVis() {
        let vis = this;

        // For each dimension, I build a categorical scale. I store all in a y object
        vis.y = {}
        vis.dimensions.forEach(function (i) {

            vis[i] = d3.scaleLinear()
                .domain([0, d3.max(vis.displayData, d=>d[i])]) // --> Same axis range for each group
                // --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
                .range([vis.height, 0])
        })
        console.log(vis.y);

        // Build the X scale -> it find the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width])
            .domain(vis.dimensions);

        // Highlight the specie that is hovered
        vis.highlight = function(d){

            vis.selected_specie = d.cuisine

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
            // Second the hovered specie takes its color
            d3.selectAll("." + vis.selected_specie)
                .transition().duration(200)
                .style("stroke", vis.color(vis.selected_specie))
                .style("opacity", "1")
        }

        // Unhighlight
        vis.doNotHighlight = function(d){
            d3.selectAll(".line")
                .transition().duration(200).delay(1000)
                .style("stroke", function(d){ return( vis.color(d.cuisine))} )
                .style("opacity", "1")
        }



        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(vis.dimensions.map(function (p) {
                let hold = d[p];
                let scale = vis[p];
                console.log(scale(hold));
                return [vis.x(p), scale(hold)];
            }));
        }

        // Draw the lines
        vis.svg
            .selectAll("myPath")
            .data(vis.displayData)
            .enter()
            .append("path")
            .attr("class", function (d) {
                return "line " + d.cuisine
            }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (vis.color(d.cuisine))
            })
            .style("opacity", 0.5)
            .on("mouseover", vis.highlight)
            .on("mouseleave", vis.doNotHighlight)



        // Draw the axis:
        vis.svg.selectAll("myAxis")
            // For each dimension of the dataset I add a 'g' element:
            .data(vis.dimensions).enter()
            .append("g")
            .attr("class", "axis")
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + vis.x(d) + ")";
            })
            // And I build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(vis[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return d;
            })
            .style("fill", "black")


    }

}