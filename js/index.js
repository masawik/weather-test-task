const OPEN_WEATHER_API_KEY = '2b0f5ba7d2971221a38c65f917ad09cd'
const CELSIUS_SYMBOL = '°С'

async function fetchWeatherData(lat, lon, errorCb) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?units=metric&lat=${lat}&lon=${lon}&appid=${OPEN_WEATHER_API_KEY}`
    )
    return await response.json()

  } catch (e) {
    errorCb(e)
  }
}

function arrayAverage(arr) {
  const sum = arr.reduce((accum, cur) => accum + cur)
  return sum / arr.length
}

//оставить в массиве только данные с 6 до 12 часов
function filterMorningData(list) {
    return list.filter(i => {
      const date = new Date(i.dt * 1000)
      const hour = date.getHours()
      return hour >= 6 && hour <= 12
    })
  }

function getAverageAndMaxTemp(list) {
  const tempList = []
  let maxTemp = Number.MIN_SAFE_INTEGER
  list.forEach(i => {
    const temp = i.main.temp
    if (maxTemp < temp) {
      maxTemp = temp
    }
    tempList.push(temp)
  })
  const average = arrayAverage(tempList)

  return {
    max: maxTemp,
    avg: average
  }
}

(async function run() {
  //парсинг DOM элементов
  const $container = document.querySelector('.js-app')
  const $loading = $container.querySelector('.js-loading')
  const $title = $container.querySelector('.js-title')
  const $max = $container.querySelector('.js-max')
  const $avg = $container.querySelector('.js-avg')
  //callBack при ошибке запроса
  const errorCb = (e) => {
    $loading.textContent = `ошибка загрузки: ${e}`
    $loading.style.color = 'red'
  }

  const data = await fetchWeatherData(57.5901, 39.8391, errorCb)
  if (!data) return false
  const morningData = filterMorningData(data.list)
  const {avg, max} = getAverageAndMaxTemp(morningData)
  $loading.remove()

  //отображение данных
  $max.textContent += max + CELSIUS_SYMBOL
  $avg.textContent += avg.toFixed(2) + CELSIUS_SYMBOL
  Array($title, $max, $avg)
    .forEach(i => i.style.display = 'block')
})()