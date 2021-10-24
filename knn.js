/*
  AUTHOR: S.ABILASH
*/


let temp = [
  { x: 50, y: 7 },
  { x: 70, y: 8 },
  { x: 80, y: 9 },
  { x: 90, y: 9 },
  { x: 80, y: 15 },
  { x: 50, y: 10 },
  { x: 70, y: 11 },
  { x: 120, y: 14 },
  { x: 100, y: 14 },
  { x: 60, y: 15 },
  { x: 30, y: 15 },
  { x: 80, y: 10 },
  { x: 50, y: 12 },
  { x: 120, y: 18 },
  { x: 130, y: 10 },
];
let xyValues = [
 
];
let yxValues = { x: 85, y: 13 };
let neighbour = [{ x: 85, y: 13 },];

function findMin()
{
   let min = 10000000000000000000;
   for (let i = 0; i < distance.length; i++) {
     if (distance[i] < min) {
       min = distance[i];
     }
   }
   return distance.indexOf(min);
}
function update_k_values(k)
{
  for(let i=0;i<k;i++)
  {
    let index = findMin();
    console.log(index);
    let result=[{x: xyValues[index].x, y: xyValues[index].y}];
    neighbour.push(...result);
    distance.splice(index,1);
    xyValues.splice(index,1); 
  }
}

function euclid(x1,y1)
{
  let x2=yxValues.x;
  let y2=yxValues.y;
  let d = Math.sqrt(Math.pow( (x2 - x1), 2) + Math.pow( (y2 - y1), 2) );
  return d;
}


function calculate_distance()
{
  for(let i=0;i<xyValues.length;i++)
  {
    let results=euclid(xyValues[i].x,xyValues[i].y);
    distance.push(results);
  }
}
//display chart

function update_graph()
{
  new Chart("myChart", {
    type: "scatter",
    data: {
      datasets: [
        {
          pointRadius: 5,
          pointBackgroundColor: "cyan",
          data: xyValues,
          label: "Data",
          backgroundColor: "cyan",
        },
        {
          pointRadius: 5,
          pointBackgroundColor: "red",
          data: neighbour,
          label: "k-element",
          backgroundColor: "red",
        },
      ],
    },
    options: {
      legend: {
        display: true,
        labels: {
          text: "nearest",
          color: "cyan",
        },
      },

      scales: {
        xAxes: [{ ticks: { min: 0, max: 160 } }],
        yAxes: [{ ticks: { min: 0, max: 20 } }],
      },
    },
  });
}

//driver code
let slider = document.getElementById("k-range");
let rangevalue = document.getElementById("k-no");
let distance = [];

rangevalue.innerHTML = slider.value;
slider.oninput = function () {
  rangevalue.innerHTML = this.value;
  distance = [];
  neighbour = [{ x: 85, y: 13 },];
  xyValues=[]
  xyValues.push(...temp);
  calculate_distance();
  update_k_values(this.value);
  update_graph();
};

resultsObtained=[]
function displayResult()
{
  let table="<table class='results'>";
  for(let i=0;i<resultsObtained.length;i++)
  {
    table+="<tr><td>";
    table+=resultsObtained[i].id;
    table+="</td>"
    table+="<td>";
    table+=resultsObtained[i].score;
    table+="</td></tr>";
  }
  table+="</table>";
  document.getElementById("results").innerHTML=table;
}

function displayData(results)
{
  let table = "<h2>DataSet:</h2><table class='table'>";
  let data = results.data;

  for (i = 0; i < data.length; i++) {
    table += "<tr>";
    let row = data[i];
    let cells = row.join(",").split(",");
    for (j = 0; j < cells.length; j++) {
      table += "<td>";
      table += cells[j];
      table += "</td>";
    }
    table += "</tr>";
  }
  table += "</table>";
  document.getElementById("parsed_data").innerHTML=table;
}

let dataset=[[]];
let cosineRelationship=[]

function parseData(results)
{
 let data=results.data;
 for(let i=1;i<data.length;i++)
 {
   let row=data[i];
   let cells=row.join(",").split(",");
   let value=[]
   for(let j=1;j<cells.length;j++)
   {
    value.push(cells[j]);
   }
   dataset.push(value);
 }
}

function takeDotProduct(a,b)
{
  let total=0;
  for(let i=1,j=1;i<a.length && j<b.length;i++,j++)
  {
    total+=a[i]*b[j];
  }
  return total;
}
//[1,1,0,1]=> root(pow(a[i],2))
function takeMagnitude(a)
{
  let total=0;
  for(let i=1;i<a.length;i++)
  {
    total+=Math.sqrt( Math.pow(a[i],2) );
  }
  return total
}

function takeRelationScore(a,b,id)
{
  let result= a/b;
  cosineRelationship.push({score: result,id: id});
}

function takeCosineRelationship(matchDataset)
{
  for(let i=1;i<dataset.length;i++)
  {
    if(dataset[i].length==0){continue;}
    if(matchDataset[0]==dataset[i][0]){continue;}
    let dotProductResult = takeDotProduct(matchDataset,dataset[i]);
    let magnitudeofA = takeMagnitude(matchDataset);
    let magnitudeofB = takeMagnitude(dataset[i]);
    let productOfMagnitude = magnitudeofA * magnitudeofB;
    takeRelationScore(dotProductResult,productOfMagnitude,dataset[i][0]);
  }
}
function findMatch(movieName)
{
  for(let i=1;i<dataset.length;i++)
  {
    if(dataset[i][0].toLowerCase()==movieName)
    {
      return dataset[i];
    }
  }
  return "NIL"
}

function sortByScore(property)
{
  return function(a,b){
    if(a[property]>b[property]){
      return 1;
    }else if(a[property] < b[property]){
      return -1;
    }else{
      return 0;
    }
  }
}

function parseCsv()
{
  document.getElementById("results").innerHTML="";
  Papa.parse('movies.csv',{
    header: false,
    download: true,
    delimiter:  "auto",
    complete: function(results){
      parseData(results);
      let userSearch=document.getElementById("movie-search-id").value;
      if(userSearch.length!=0)
      {
        gotMatch = findMatch(userSearch.toLowerCase());
        if(gotMatch!="NIL")
        {
          takeCosineRelationship(gotMatch);
          cosineRelationship.sort(sortByScore("score")).reverse();
          //k value is 10
          for(let k=0;k<10;k++)
          {
            resultsObtained.push(cosineRelationship[k]);
          }
          displayResult();
        }else{
          alert("No Such Moive Found");
        }      
        
      }     
    }
  });
}

//for showing dataset in the webpage
function loadDataset() {
  Papa.parse("movies.csv", {
    header: false,
    download: true,
    delimiter: "auto",
    complete: function (results) {
      displayData(results);

    },
  });
}
