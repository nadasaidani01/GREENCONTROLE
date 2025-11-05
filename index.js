


// humidityAir
// : 
// 62.8
// humiditySoil
// : 
// 57
// lightPercent
// : 
// 100
// pump
// : 
// "🛑 Pompe ARRÊTÉE !"
// rainPercent
// : 
// 0
// temperature
// : 
// 25
// water
// : 
// "OK"
 

const   HandelKnowLight = (t)=> {
  let c = "";
  for (let i = 0; i < t.length; i++) {
    if ((t[i] >= "0" && t[i] <= "9") || t[i] === ".") {
      c += t[i];
    }
  }
  return 100-Number(c);
}
 




const HandelGetAPiUsinGFeach = async (api)=>{

    const data  =await fetch(api).then((rep)=>rep.json()).catch((error)=>console.log(error))
    return data
}

//☀
// setIntrval function techbha el while
let temp = document.getElementById("tem")
let Humidity = document.getElementById("Humidity")
let Soil = document.getElementById("Soil")
let rain = document.getElementById("rain")
let Light = document.getElementById("Light")
let waterlevel = document.getElementById("waterlevel")
let waterbox = document.querySelector(".water-fill")
let parentdiv = document.querySelector(".parentdiv")
let lightChange = document.getElementById("lightChange")

setInterval(async()=>{
const datforFrontned = await HandelGetAPiUsinGFeach("http://127.0.0.1:8000/api")
 
console.log("humidityAir",datforFrontned.humidityAir)
console.log("humiditySoil",datforFrontned.humiditySoil)
console.log("lightPercent",datforFrontned.lightPercent,)
console.log("temperature",datforFrontned.temperature)
console.log("water",datforFrontned.water)
console.log("rainPercent",datforFrontned.rainPercent)
console.log("pump",datforFrontned.pump
)

temp.innerText = `${datforFrontned.temperature} °C`
Humidity.innerText = `${datforFrontned.humidityAir} %`
Soil.innerText = `${datforFrontned.humiditySoil} °C`
rain.innerText = `${datforFrontned.rainPercent} %`
Light.innerText = `${HandelKnowLight(datforFrontned.lightPercent)}%`
  

waterlevel.innerText = `${datforFrontned.water=="OK"?"Optimal":"Empty"} `
console.log(datforFrontned,"<==")
 
 if(datforFrontned.water === "OK") {
    waterbox.classList.add("water-fill");
    waterbox.classList.remove("water-fillRed");
} else {
    waterbox.classList.add("water-fillRed");
    waterbox.classList.remove("water-fill");
}
 
datforFrontned.pump == "Pompe ACTIVÉE !"  ? (parentdiv.innerHTML = `<div class="pump-container">
  <div class="pump-body">
    <div class="pump-nozzle"></div>
    <div class="water"></div>
    <div class="water"></div>
    <div class="water"></div>
  </div>`)

:  (parentdiv.innerHTML = `
    <div class="pump-container">
  <div class="pump-body">
    <div class="pump-nozzle"></div>
  
  </div>`);



},1000)

