class Scatter {

    // constructor method to initialize Timeline object
    constructor(parentElement, businessData) {
        this.parentElement = parentElement;
        this.data = businessData;
        this.displayData = [];

        // Add colors
        this.colors = ["#ee4035", "#f37736", "#fdf498", "#7bc043", "#0392cf", "#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b", "#008744", "#0057e7", "#d62d20"];

        this.initVis()

    }
    initVis() {

        let vis = this;
        vis.margin = {top: 20, right: 30, bottom: 80, left: 30};
        vis.width = .7 * ($("." + vis.parentElement).width() - vis.margin.left - vis.margin.right);
        vis.height = .7 * ($("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom);

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Create X scale
        vis.xScale = d3.scaleLinear()
            .domain([0, 5])
            .range([60, vis.width]);

        // Create Y scale
        vis.yScale = d3.scaleLinear()
            .range([vis.height - 50, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.xScale);

        vis.yAxis = d3.axisLeft()
            .scale(vis.yScale);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (vis.height - 50) + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis")
            .attr("transform", "translate(" + 60 + ",0)");

        // Axis titles
        vis.svg.append("text")
            .attr("x", 70)
            .attr("y", 15)
            .text("Check Ins");
        vis.svg.append("text")
            .attr("x", vis.width - 50)
            .attr("y", vis.height - 5)
            .text("Star Rating");

        // Color scale: give me a specie name, I return a color
        vis.colorScale = d3.scaleOrdinal()
            .domain(["French", "American", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican", "Fast Food", "Greek", "Ethnic Food", "Other"])
            .range(["#ffed6f", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#f6a6ff", "#bc80bd", "#ccebc5", "#8dd3c7"]);

        // Append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'scatterTooltip');

        vis.wrangleData();

    }
    wrangleData () {
        let vis = this;

        vis.displayData = [];

        // Use menu selections to filter data by city and cuisine
        vis.data.forEach(function(restaurant) {

            if (selectedCuisine == "all" && selectedScatterCategory == "all") {
                if (restaurant.review_count > 20) {
                    vis.displayData.push(
                        {
                            name: restaurant.name,
                            city: restaurant.city,
                            checkIns: restaurant.checkIns,
                            stars: restaurant.stars,
                            review_count: restaurant.review_count,
                            cuisine: restaurant.categories[0]
                        })
                }
            }
            if (selectedCuisine != "all" && selectedScatterCategory == "all") {
                if (restaurant.categories[0] == selectedCuisine && restaurant.review_count > 20) {
                    vis.displayData.push(
                        {
                            name: restaurant.name,
                            city: restaurant.city,
                            checkIns: restaurant.checkIns,
                            stars: restaurant.stars,
                            review_count: restaurant.review_count,
                            cuisine: restaurant.categories[0]
                        })
                }
            }
            if (selectedCuisine == "all" && selectedScatterCategory != "all") {
                if (restaurant.city == selectedScatterCategory && restaurant.review_count > 20) {
                    vis.displayData.push(
                        {
                            name: restaurant.name,
                            city: restaurant.city,
                            checkIns: restaurant.checkIns,
                            stars: restaurant.stars,
                            review_count: restaurant.review_count,
                            cuisine: restaurant.categories[0]
                        })
                }
            }
            if (selectedCuisine != "all" && selectedScatterCategory != "all") {
                if (restaurant.city == selectedScatterCategory && restaurant.categories[0] == selectedCuisine && restaurant.review_count > 20) {
                    vis.displayData.push(
                        {
                            name: restaurant.name,
                            city: restaurant.city,
                            checkIns: restaurant.checkIns,
                            stars: restaurant.stars,
                            review_count: restaurant.review_count,
                            cuisine: restaurant.categories[0]
                        })
                }
            }

        });

        vis.updateVis();

    }
    updateVis () {
        let vis = this;

        // Set y scale domain
        vis.yScale.domain([0, d3.max(vis.displayData, d=>d.checkIns) + 200]);

        // Define points
        let points = vis.svg.selectAll(".point")
            .data(vis.displayData)

        // Create points
        points.enter().append("circle")
            .attr("class", "point")

            // Update points
            .merge(points)
            .attr("r", 5)
            .attr("cx", d=>vis.xScale(d.stars))
            .attr("cy", d=>vis.yScale(d.checkIns))
            .attr("fill", d => vis.colorScale(d.cuisine))
            .style("stroke", "darkgray")
            // Add tooltip functionality
            .on('mouseover', function(event, d){
                // vis.tooltip
                //     .style("opacity", 1)
                //     .style("left", event.pageX + 20 + "px")
                //     .style("top", event.pageY + "px")
                //     .html("<div style= 'font-size: xx-small'> " +
                //         "<p style= 'font-size: small'>" + d.name + "<p>" +
                //         "<p> Category: " + d.cuisine + "<p>" +
                //         "<p> Stars: " +  d.stars + "<p>" +
                //         "<p> Reviews: " +  d.review_count + "<p>" +
                //         "</div>");
                document.getElementById('name').textContent = "Name: " + d.name;
                document.getElementById('city').textContent = "City: " + d.city;
                document.getElementById('category').textContent = "Category: " + d.cuisine;
                document.getElementById('stars').textContent = "Stars: " + d.stars;
                document.getElementById('reviews').textContent = "Reviews: " + d.review_count;

            })
            .on('mouseout', function(event,d){
                // vis.tooltip
                //     .style("opacity", 0)
                //     .style("left", 0)
                //     .style("top", 0)
                //     .html("");
                document.getElementById('name').textContent = "";
                document.getElementById('city').textContent = "";
                document.getElementById('category').textContent = "";
                document.getElementById('stars').textContent = "";
                document.getElementById('reviews').textContent = "";
            });


        // Exit
        points.exit().remove();

        // Call axes
        vis.svg.select(".y-axis").transition().duration(800).call(vis.yAxis);
        vis.svg.select(".x-axis").call(vis.xAxis);

    }


}