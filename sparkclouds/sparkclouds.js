var fill = "#000080";//d3.scaleOrdinal(d3.schemeCategory20);

var event = [];
var scaleCount = d3.scaleLinear().range([20,60]);
var max_count = 0;

d3.csv("shop_count.csv", function(error, data){
  var e = $("#ruler");

  for (var i = 0; i < data.length; i++) {
  	var obj = {"name":"a","frequency":new Array(24),"size":0};
  	obj.name = data[i].name;

    var count = 0;
    for(var j = 0; j < 24; j++){
      obj.frequency[j] = Number(data[i][j]);
      count += Number(data[i][j]);

    }
    obj.size = count;
    if(max_count < count) max_count = count;

    obj.t_width = e.text(obj.name).get(0).offsetWidth;
    obj.t_height = e.text(obj.name).get(0).offsetHeight;

    event.push(obj);
  }
  drawtag();

});

var width = 900;
var height = 800;

var tag_w_l = 100;
var tag_h_l = 30;

function drawtag(){
  scaleCount.domain([0,max_count]);

  d3.layout.cloud()
    .size([width, height])
    .words(event)
    .padding(5)
    //.rotate(function() { return ~~ (Math.random() * 2) * 90; })
    //.font("Impact")
    .fontSize(function(d) { return scaleCount(d.size);})
    .on("end", draw)
    .start();
}

function draw(event) {
	//eventはいろいろ追加されている
  var svg = d3.select('body').append('svg')
            .attr("width", width).attr("height", height)
            .append('g');
  var sx=10,sy=40;
  for(var i = 0; i < event.length; i++){
    d = event[i];
    d.x = sx; d.y = sy;
    var t_width = d.t_width * d.size * 0.06;

    if(t_width + 15 < tag_w_l){
      sx += tag_w_l + 15;
    }else{
     sx += t_width+15;
    }
    if(sx > width - 150) { sx = 10; sy += tag_h_l*2;}
  }

  for(var i = 0; i < event.length; i++){
    sparkline(event[i],i);
  }

  svg.selectAll("text")
      .data(event)
      .enter()
      .append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      //.style("font-family", "Impact")
      .style("fill", function(d, i) { return fill; })
      .style("cursor", "pointer")
      .attr("text-anchor", "left")
      .text(function(d) { return d.name; })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")";
      });
}

function sparkline(e,index){
  //var tag_width = e.t_width * e.size * 0.06;
  //var tag_height = e.t_height * e.size * 0.1;
  var tag_width = tag_w_l;
  var tag_height = tag_h_l;

	var x = d3.scaleLinear().range([0,tag_width]);
	var y = d3.scaleLinear().range([0,tag_height]);

	x.domain([0,23]);
	y.domain([0,d3.max(e.frequency)]);

	var svg = d3.select('body').select('svg').select('g')
		          .append('svg')
		          .attr('width', tag_width)
		          .attr('height', tag_height)
		          .attr('transform', function(d){
		          	return "translate("+ [e.x,e.y] +")";
		          });
  svg.append('rect').attr('width',tag_width).attr('height',tag_height).attr('fill', "#DDDDDD");

	svg.selectAll('.bar')
    .data(e.frequency)
    .enter()
    .append('rect')
    .attr("class", "bar")
    .attr('width', function(d){
      return tag_width/24;
    })
    .attr('height', function(d){
      return y(d);
    })
    .attr('transform', function(d,i){
      return "translate("+ [x(i),tag_height-y(d)] +")"
    })
    .style('fill',function(d){ return "#AA4433";});
}


