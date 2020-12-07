let cityCenters = {
    "Calgary":{
        "lat": 51.0447,
        "long": -114.0719,
    },
    "Mesa":{
        "lat": 33.4152,
        "long": -111.8315
    },
    "Phoenix":{
        "lat": 33.4484,
        "long": -112.0740
    },
    "Scottsdale":{
        "lat": 33.4942,
        "long": -111.9261
    },
    "Charlotte":{
        "lat": 35.2271,
        "long": -80.8431
    },
    "Las Vegas":{
        "lat": 36.1699,
        "long": -115.1398
    },
    "Toronto":{
        "lat": 43.6532,
        "long": -79.3832
    },
    "Pittsburgh":{
        "lat": 40.4406,
        "long": -79.9959
    },
    "Montréal":{
        "lat": 45.5017,
        "long": -73.5673
    },
}

function distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344
        return dist;
    }
}

class Radius {

    // constructor method to initialize Timeline object
    constructor(parentElement, businessData) {
        this.parentElement = parentElement;
        this.data = businessData;
        this.displayData = [];

        //this.colors = ["#d7191c", "#fdae61", "#ffffbf", "#abd9e9", "#2c7bb6"]
        this.colors = ["#2c7bb6", "#abd9e9", "#ffffbf", "#fdae61", "#d7191c"]
        this.initVis()
    }
    initVis(){
        let vis = this;
        vis.margin = {top: 20, right: 30, bottom: 100, left: 30};
        vis.width = .7 * ($("." + vis.parentElement).width() - vis.margin.left - vis.margin.right);
        vis.height = .7 * ($("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom);

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.r = d3.scaleLinear()
            .range([10, vis.height/2 - vis.margin.top]);

        vis.colorScale = d3.scaleOrdinal()
            .domain([1,2,3,4,5])
            .range(vis.colors)

        vis.legend =  vis.svg.append("g")

        vis.legend.selectAll(".legend")
            .data(vis.colors)
            .enter()
            .append("circle")
            .attr("cx", function(d, i){
                return i * 90 + 15
            })
            .attr("cy", 15)
            .attr("r", 15)
            .style("fill", function(d){
                return d
            })
            .style("stroke", "darkgray")
            .attr("class", "legend")
            .on('mouseover', function(event, d) {
                let selector = vis.colors.indexOf(d) + 1
                vis.svg.selectAll(".circles").attr("opacity", 0.2)
                vis.svg.selectAll("#rating-" + selector).attr("opacity", 1)
            })
            .on('mouseout', function(event, d) {
                vis.svg.selectAll(".circles").attr("opacity", 1)
            })


        vis.legend.selectAll(".legend-labels")
            .data(vis.colors)
            .enter()
            .append("text")
            .attr("x", function(d, i){
                return i * 90 + 35
            })
            .attr("y", 20)
            .text(function(d, i){
                return i+1 + " Star"
            })
            .attr("class", "legend-labels");


        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'distanceTooltip');

        vis.tooltipCenter = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'centerTooltip');


        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        vis.displayData = [];

        if (selectedCuisine == "all" && selectedScatterCategory == "all"){
            vis.filtered =  vis.data.filter(rest => rest.review_count > 20)
        }
        else if (selectedCuisine == "all"){
            vis.filtered =  vis.data.filter(rest => rest.city== selectedScatterCategory && rest.review_count > 20)
        }
        else if (selectedScatterCategory = "all"){
            vis.filtered =  vis.data.filter(rest => rest.categories[0]== selectedCuisine && rest.review_count > 20)
        }
        else{
            vis.filtered =  vis.data.filter(rest => rest.city == selectedScatterCategory && rest.categories[0] == selectedCuisine && rest.review_count > 20)
        }

        vis.filtered.forEach(rest => {
                if (rest.city == "Calgary" ||rest.city == "Mesa" || rest.city =="Phoenix"||  rest.city =="Scottsdale"|| rest.city =="Charlotte"|| rest.city =="Las Vegas"||rest.city == "Toronto"||rest.city == "Pittsburgh"||rest.city == "Montréal")
                {
                    let distance1 = distance(rest.latitude, rest.longitude, cityCenters[rest.city].lat, cityCenters[rest.city].long)
                    vis.displayData.push(
                        {
                            rest,
                            distance:distance1
                        })
                }
            })

        vis.displayVis();
    }
    displayVis(){
        let vis = this;
        let domain_max = d3.max(vis.displayData, d => d["distance"])

        //vis.max = d3.max(vis.displayData, d => d["distance"])
        vis.r.domain([0, domain_max]);
        vis.random = []
        vis.random = Array.from({length: vis.displayData.length}, () => Math.random() * 2 * Math.PI);

        vis.circles = vis.svg.selectAll(".circles")
            .data(vis.displayData);

        vis.circles.enter().append("circle")
            .attr("class", "circles")
            .attr("id", function(d,i){
                return "rating-" + Math.round(d.rest.stars)
            })
            .merge(vis.circles)
            .on('mouseover', function(event, d){
                // vis.tooltip
                //     .style("opacity", 1)
                //     .style("left", event.pageX + 20 + "px")
                //     .style("top", event.pageY + "px")
                //     .html("<div style= 'font-size: xx-small'> " +
                //         "<p style= 'font-size: small'>" + d.rest.name + "<p>" +
                //         "<p> Category: " + d.rest.categories[0] + "<p>" +
                //         "<p> Stars: " +  d.rest.stars + "<p>" +
                //         "<p> Reviews: " +  d.rest.review_count + "<p>" +
                //         "<p> Distance: " +  Math.round(d.distance) + "<p>" +
                //         "</div>");
                document.getElementById('name').textContent = "Name: " + d.rest.name;
                document.getElementById('city').textContent = "City: " + d.rest.city;
                document.getElementById('category').textContent = "Category: " + d.rest.categories[0];
                document.getElementById('stars').textContent = "Stars: " + d.rest.stars;
                document.getElementById('reviews').textContent = "Reviews: " + d.rest.review_count;
                document.getElementById('distance').textContent = "Distance from City Center: " + Math.round(d.distance) + " km";


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
                document.getElementById('distance').textContent = "";

            })
            .transition().duration(500)
            .attr("cx", function(d, i){
                //adapted from https://stackoverflow.com/questions/53146015/generate-random-points-within-an-svg-circle-area-in-d3-or-javascript
                let r = vis.r(d.distance);
                return vis.width/2 + r * Math.cos(vis.random[i]);
            })
            .attr("cy", function(d,i){
                let r = vis.r(d.distance);
                return vis.height/2 + r * Math.sin(vis.random[i]);
            })
            .attr("r", 4)
            .style("fill", function(d){
                return vis.colorScale(Math.round(d.rest.stars))
            })
            .style("stroke", "darkgray")


        vis.circles.exit().remove();

        vis.radius = [domain_max, domain_max - .20*domain_max, domain_max - .40*domain_max, domain_max - .60*domain_max, domain_max - .80*domain_max]

        vis.svg.append("circle")
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
            .attr("r", 10)
            .style("fill", "black")
            .on('mouseover', function(event, d){
                vis.tooltipCenter
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html("<div style= 'font-size: xx-small'> " +
                        "<p style= 'font-size: small'> City Center <p>" +
                        "</div>");
            })
            .on('mouseout', function(event,d){
                vis.tooltipCenter
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html("");
            })

        vis.bands = vis.svg.selectAll(".bands")
            .data(vis.radius);

        vis.bands.enter().append("circle")
            .attr("class", "bands")
            .merge(vis.bands)
            .transition().duration(500)
            .attr("cx", vis.width/2)
            .attr("cy", vis.height/2)
            .attr("r", function(d,i){
                return vis.r(vis.radius[i])
            })
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("opacity", 0.3)

        vis.bands.exit().remove();

        vis.bandLabels = vis.svg.selectAll(".band-labels")
            .data(vis.radius);

        vis.bandLabels.enter().append("text")
            .attr("class", "band-labels")
            .merge(vis.bandLabels)
            .attr("x", function(d,i){
                return vis.width/2 + vis.r(vis.radius[i])
            })
            .attr("y", vis.height/2)
            .attr("fill", "black")
            .attr("stroke", "black")
            .text(function(d,i){
                return Math.round(vis.radius[i]) + "km"
            })

        vis.bandLabels.exit().remove();

    }
}