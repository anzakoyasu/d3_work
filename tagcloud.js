var fill = d3.scaleOrdinal(d3.schemeCategory20);

var event = [];
var scaleCount = d3.scaleLinear().range([20,70]);
var max_count = 0;

d3.csv("crime_type.csv", function(error, data){
  for (var i = 0; i < data.length; i++) {
  	var obj = {"name":"a","frequency":new Array(24),"size":0};
  	obj.name = data[i].name;
    var count = 0;
    for(var j = 0; j < 24; j++){
      obj.frequency[j] = data[i][j];
      count += Number(data[i][j]);
    }
    obj.size = count;
    if(max_count < count) max_count = count;

    event.push(obj);
  }
  drawtag();

});

var width = 800;
var height = 800;

function drawtag(){
scaleCount.domain([0,max_count]);

d3.layout.cloud()
  .size([width, height])
  .words(event)
  .padding(5)
  //.rotate(function() { return ~~ (Math.random() * 2) * 90; })
  .font("Impact")
  .fontSize(function(d) { return scaleCount(d.size);})
  .on("end", draw)
  .start();
}

function draw(event) {
	//eventはいろいろ追加されている

    var svg = d3.select('body')
		      .append('svg');
    svg.attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate("+ width/2 +","+ height/2 +")")
      .selectAll("text")
      .data(event)
      .enter()
      .append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .style("cursor", "pointer")
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")"; 
      })
      .text(function(d) { return d.name; });

    for(var i = 0; i < event.length; i++){
    	sparkline(event[i],i);
    }
}



function sparkline(e,index/*elemId, data*/){

	var x = d3.scaleLinear().range([0,100]);
	var y = d3.scaleLinear().range([0,20]);

	x.domain([0,23]);
	y.domain([0,d3.max(e.frequency)]);

	var svg = d3.select('body').select('svg').select('g')
		.append('svg')
		.attr('width', 100)
		.attr('height', 20)
		.attr('transform', function(d){
			return "translate("+ [e.x,e.y] +")";
		});

	svg.selectAll('.bar')
		.data(e.frequency)
		.enter()
		.append('rect')
		.attr("class", "bar")
		.attr('width', function(d){
			return 98/23;
		})
		.attr('height', function(d){
			return y(d);
		})
		.attr('transform', function(d,i){
			return "translate("+ [x(i),20-y(d)] +")"
		})
		.style('fill',function(d){ return fill(index);});

/*	svg.append('path')
		.datum(e.frequency)
		.attr('class', 'sparkline')
		.attr('d',line)
		.style("stroke-width", function(d){ return e.size/10;})
		.style("stroke", function(d) { return fill(index); });*/
}