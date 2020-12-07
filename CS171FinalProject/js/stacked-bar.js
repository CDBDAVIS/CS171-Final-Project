class Bar {

    // constructor method to initialize Timeline object
    constructor(parentElement, businessData) {
        this.parentElement = parentElement;
        this.data = businessData;
        this.stackable = [];
        this.categories = [];
        this.displayData = {
            "1":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "2":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "3":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "4":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "5":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
        };

        // Add colors
        this.colors = [];

        this.initVis()

    }
    initVis() {
        let vis = this;

        vis.margin = {top: 20, right: 30, bottom: 80, left: 30};
        vis.width = .6 * ($("." + vis.parentElement).width() - vis.margin.left - vis.margin.right);
        vis.height = .7 * ($("." + vis.parentElement).height() - vis.margin.top - vis.margin.bottom);

        // init drawing area
        vis.svg = d3.select("." + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .padding([0.4])

        vis.y = d3.scaleLinear()
            .range([vis.height, 0 ]);


        vis.categories = ["American", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican","French","Fast Food", "Greek", "Ethnic Food"]

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip');


        vis.yAxis = vis.svg.append("g")
            .attr("transform", "translate(" + vis.margin.left*2 + ",0)")

        vis.xAxis = vis.svg.append("g")
            .attr("transform", "translate(" + vis.margin.left*2 +","+ vis.height + ")")

        vis.groupPrep = vis.svg.append("g").selectAll("g")

        vis.xAxis
            .append("text")
            .attr("x", vis.width)
            .attr("y", -10)
            .text("Star Category")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("class", "axis-label");

        vis.yAxis
            .append("text")
            .attr("x", 0)
            .attr("y", 15)
            //.attr("transform, rotate(90,0)")
            .text("Number of Restaurants in Category")
            .attr("text-anchor", "end")
            .attr("fill", "black")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)");





        vis.wrangleData();
    }
    wrangleData(){
        let vis = this;
        vis.stackable = []

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
            vis.filtered =  vis.data.filter(rest => rest.city == selectedScatterCategory && rest.categories[0] == selectedCuisine)
        }
        vis.displayData = {
            "1":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "2":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "3":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "4":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
            "5":{
                "French": 0,
                "American": 0,
                // "American (Traditional)": 0,
                // "American (New)": 0,
                "Breakfast & Brunch":0,
                "Asian Fusion":0,
                "Chinese":0,
                "Japanese":0,
                "Sushi Bars":0,
                "Mexican":0,
                "Fast Food":0,
                "Greek":0,
                "Ethnic Food":0,
                "Other":0,
                "Total":0
            },
        };
        vis.filtered.forEach(row=> {
            vis.displayData[Math.round(row.stars)][(row.categories[0])]++;
            vis.displayData[Math.round(row.stars)]["Total"]++;
        })
        let range = [1,2,3,4,5];
        range.forEach(number=>{
            vis.stackable.push({
                Rating: number,
                "French": vis.displayData[number]["French"],
                "American": vis.displayData[number]["American"],
               // "American": vis.displayData[number]["American (Traditional)"] + vis.displayData[number]["American (New)"],
                "Breakfast & Brunch":vis.displayData[number]["Breakfast & Brunch"],
                "Asian Fusion":vis.displayData[number]["Asian Fusion"],
                "Chinese":vis.displayData[number]["Chinese"],
                "Japanese":vis.displayData[number]["Japanese"],
                "Sushi Bars":vis.displayData[number]["Sushi Bars"],
                "Mexican":vis.displayData[number]["Mexican"],
                "Fast Food":vis.displayData[number]["Fast Food"],
                "Greek":vis.displayData[number]["Greek"],
                "Ethnic Food":vis.displayData[number]["Ethnic Food"],
                //"Other":vis.displayData[number]["Other"],
                "Total":vis.displayData[number]["Total"] - vis.displayData[number]["Other"]
            })
        })

        console.log(vis.stackable)


        vis.displayVis();
    }
    displayVis(){
        let vis = this;

        vis.y.domain([0, d3.max(vis.stackable, d => d["Total"])]);

        vis.x.domain([1,2,3,4,5])

        vis.xAxis.call(d3.axisBottom(vis.x).tickSizeOuter(0));


        let stack = d3.stack().keys(vis.categories).order(d3.stackOrderDescending)

        vis.stacked = stack(vis.stackable)

        // Color scale: give me a specie name, I return a color
        vis.color = d3.scaleOrdinal()
            .domain(["French", "American", "Breakfast & Brunch", "Asian Fusion", "Chinese", "Japanese", "Sushi Bars", "Mexican", "Fast Food", "Greek", "Ethnic Food", "Other"])
            .range(["#ffed6f", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#f6a6ff", "#bc80bd", "#ccebc5", "#8dd3c7"]);

        vis.svg.selectAll("#rectsStacked").remove();

        vis.group = vis.groupPrep
            // Enter in the stack data = loop key per key = group per group
            .data(vis.stacked, d => d)
            .enter().append("g")
            .attr("fill", function(d) {
                return vis.color(d.key); })
            .attr("class", function(d){
                return d.key.split(' ')[0]
            })
            .attr("id", "rectsStacked")


        vis.group2 = vis.group.selectAll(".rects").data(function(d) { return d, d; })

        // enter a second time = loop subgroup per subgroup to add all rectangles

        vis.group2.enter().append("rect")
            .attr("class", "rects")
            .merge(vis.group2)
            .attr("x", function(d) {
                return vis.x(Math.round(d.data.Rating)); })
            .attr("y", function(d) { return vis.y(d[1]); })
            .attr("width",vis.x.bandwidth())
            .attr("transform", "translate(" + vis.margin.left*2 + ",0)")
            .on('mouseover', function(event, d){
                d3.selectAll("#rectsStacked")
                    .style('opacity', 0.3)
                var rating = d.data["Rating"]
                var percent = Math.round(((d[1]) - (d[0]))/ (vis.displayData[rating]["Total"] - vis.displayData[rating]["Other"])*100)
                var category = d3.select(this.parentNode).datum().key;
                vis.tooltip
                    .style("opacity", 1)
                    .style("left", event.pageX + 20 + "px")
                    .style("top", event.pageY + "px")
                    .html("<div style= 'font-size: xx-small'> " +
                        "<p style= 'font-size: small'> Cuisine Type:  " + category + "<p>" +
                        "<p style= 'font-size: small'> Percent : " + percent + "%</p>" +
                        "</div>");

                d3.select("." + category.split(' ')[0])
                    .style('opacity', 1)
            })
            .on('mouseout', function(event, d) {
                d3.selectAll("#rectsStacked")
                    .style('opacity', 1)


                vis.tooltip
                    .style("opacity", 0)
                    .style("left", 0)
                    .style("top", 0)
                    .html("");
            })
            .transition().duration(500)
            .attr("height", function(d) { return vis.y(d[0]) - vis.y(d[1]); })

        vis.group2.exit().remove();


        vis.yAxis.call(d3.axisLeft(vis.y))//.tickSizeOuter(0));

    }


}