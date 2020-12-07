// Based on: https://www.d3-graph-gallery.com/graph/parallel_custom.html

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

        // Set margins, width, and height
        vis.margin = {top: 20, right: 30, bottom: 150, left: 50};
        vis.width = .7 * ($("." + vis.parentElement).width() - vis.margin.left - vis.margin.right);
        vis.height = .7 * ($("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom);

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        // Color scale: give me a cuisine, return a color
        vis.color = d3.scaleOrdinal()
            .domain(["French", "American", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican", "Fast Food", "Greek", "Ethnic Food", "Other"])
            .range(["#ffed6f", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#f6a6ff", "#bc80bd", "#ccebc5", "#8dd3c7"]);

        // Here I set the list of dimension manually to control the order of axis:
        vis.dimensions = ["reservations", "checkIns", "outdoorSeating", "review_count", "stars"]

        // Append tooltip
        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'parallelTooltip');

        vis.wrangleData();
    }

    wrangleData(values) {
        let vis = this;

        // Clear display data
        vis.displayData = [];

        // Use menu selections to filter data by city and cuisine
        vis.data.forEach(function (restaurant, index) {

            if (restaurant.review_count > 20 && restaurant.price != "None"  && restaurant.attributes != null) {

                if (selectedCuisine == "all" && selectedScatterCategory == "all") {
                    vis.displayData.push(
                        {
                            id: index,
                            name: restaurant.name,
                            city: restaurant.city,
                            cuisine: restaurant.categories[0],
                            checkIns: restaurant.checkIns,
                            price: +restaurant.price,
                            review_count: restaurant.review_count,
                            stars: restaurant.stars,
                            reservations: restaurant.attributes.RestaurantsReservations,
                            outdoorSeating: restaurant.attributes.OutdoorSeating
                        })
                }
                if (selectedCuisine != "all" && selectedScatterCategory == "all") {
                    if (restaurant.categories[0] == selectedCuisine) {
                        vis.displayData.push(
                            {
                                id: index,
                                name: restaurant.name,
                                city: restaurant.city,
                                cuisine: restaurant.categories[0],
                                checkIns: restaurant.checkIns,
                                price: +restaurant.price,
                                review_count: restaurant.review_count,
                                stars: restaurant.stars,
                                reservations: restaurant.attributes.RestaurantsReservations,
                                outdoorSeating: restaurant.attributes.OutdoorSeating
                            })
                    }
                }
                if (selectedCuisine == "all" && selectedScatterCategory != "all") {
                    if (restaurant.city == selectedScatterCategory) {
                        vis.displayData.push(
                            {
                                id: index,
                                name: restaurant.name,
                                city: restaurant.city,
                                cuisine: restaurant.categories[0],
                                checkIns: restaurant.checkIns,
                                price: +restaurant.price,
                                review_count: restaurant.review_count,
                                stars: restaurant.stars,
                                reservations: restaurant.attributes.RestaurantsReservations,
                                outdoorSeating: restaurant.attributes.OutdoorSeating
                            })
                    }
                }
                if (selectedCuisine != "all" && selectedScatterCategory != "all") {
                    if (restaurant.city == selectedScatterCategory && restaurant.categories[0] == selectedCuisine) {
                        vis.displayData.push(
                            {
                                id: index,
                                name: restaurant.name,
                                city: restaurant.city,
                                cuisine: restaurant.categories[0],
                                checkIns: restaurant.checkIns,
                                price: +restaurant.price,
                                review_count: restaurant.review_count,
                                stars: restaurant.stars,
                                reservations: restaurant.attributes.RestaurantsReservations,
                                outdoorSeating: restaurant.attributes.OutdoorSeating
                            })
                    }
                }
            }

        });

        vis.displayData = vis.displayData.filter(d => d.reservations != undefined && d.reservations != "None" && d.outdoorSeating != undefined && d.outdoorSeating != "None");
        vis.displayData = vis.displayData.filter(d => d.price >= priceRange[0] && d.price <= priceRange[1]);

        vis.updateVis();

    }

    updateVis() {
        let vis = this;

        // For each dimension, I build a categorical scale.
        vis.dimensions.forEach(function (i) {

            if (i == "price" || i == "review_count" || i == "stars" || i == "checkIns") {
                vis[i] = d3.scaleLinear()
                    .domain([0, d3.max(vis.displayData, d => d[i])]) // --> Different axis range for each group
                    .range([vis.height, 0])
            }
            else {
                vis[i] = d3.scaleOrdinal()
                    .domain(["False", "True"])
                    .range([vis.height, 0])
            }
        })

        // Build the X scale -> finds the best position for each Y axis
        vis.x = d3.scalePoint()
            .range([0, vis.width])
            .domain(vis.dimensions);

        // Highlight the cuisine that is hovered
        vis.highlight = function (d) {

            vis.selected_restaurant = "id" + d.id

            // first every group turns grey
            d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.1")
            // Second the hovered specie takes its color
            d3.selectAll("." + vis.selected_restaurant)
                .transition().duration(200)
                .style("stroke", vis.color(d.cuisine))
                .style("stroke-width", 15)
                .style("opacity", "1")
        }

        // Unhighlight
        vis.doNotHighlight = function (d) {
            d3.selectAll(".line")
                .transition().duration(200).delay(1000)
                .style("stroke", function (d) {
                    return (vis.color(d.cuisine))
                })
                .style("stroke-width", null)
                .style("opacity", "1")
        }

        // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
        function path(d) {
            return d3.line()(vis.dimensions.map(function (p) {
                let value = d[p];
                let scale = vis[p];
                return [vis.x(p), scale(value)];
            }));
        }

        // Define lines
        let lines = vis.svg.selectAll(".line")
            .data(vis.displayData);

        // Draw the lines
        lines.enter().append("path")
            .merge(lines)
            .attr("class", function (d) {
                return "line id" + d.id
            }) // 2 class for each line: 'line' and the group name
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", function (d) {
                return (vis.color(d.cuisine))
            })
            .style("opacity", 0.5)
            // Add tooltip and highlight features
            .on('mouseover', function(event, d){

                vis.highlight(d);
                // vis.tooltip
                //     .style("opacity", 1)
                //     .style("left", event.pageX + 20 + "px")
                //     .style("top", event.pageY + "px")
                //     .html("<div style= 'font-size: xx-small'> " +
                //         "<p style= 'font-size: small'>" + d.name + "<p>" +
                //         "<p> Category: " + d.cuisine + "<p>" +
                //         "<p> Stars: " +  d.stars + "<p>" +
                //         "<p> Reservations: " +  d.reservations + "<p>" +
                //         "<p> Outdoor Seating: " +  d.outdoorSeating + "<p>" +
                //         "</div>");
                document.getElementById('name').textContent = "Name: " + d.name;
                document.getElementById('city').textContent = "City: " + d.city;
                document.getElementById('category').textContent = "Category: " + d.cuisine;
                document.getElementById('stars').textContent = "Stars: " + d.stars;
                document.getElementById('reviews').textContent = "Reviews: " + d.review_count;


            })
            .on('mouseout', function(event,d){

                vis.doNotHighlight(d);
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
        lines.exit().remove();

        // Define axes
        let axes = vis.svg.selectAll(".parallel-axis")
            .data(vis.dimensions);

        // Draw the axes
        axes.enter()
            .append("g")
            .attr("class", "axis parallel-axis")
            .merge(axes)
            // I translate this element to its right position on the x axis
            .attr("transform", function (d) {
                return "translate(" + vis.x(d) + ")";
            })
            // Build the axis with the call function
            .each(function (d) {
                d3.select(this).call(d3.axisLeft().scale(vis[d]));
            })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function (d) {
                return axisTitle(d);
            })
            .style("fill", "black");

        // Exit
        axes.exit().remove();


    }

}

function axisTitle(varname) {
    if (varname == "reservations") {
        return "Accepts Reservations"
    }
    if (varname == "checkIns") {
        return "Check Ins"
    }
    if (varname == "outdoorSeating") {
        return "Outdoor Seating"
    }
    if (varname == "review_count") {
        return "Number of Reviews"
    }
    if (varname == "stars") {
        return "Star Rating"
    }
}