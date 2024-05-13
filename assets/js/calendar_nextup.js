document.addEventListener("DOMContentLoaded", loadCalendarData)

async function loadCalendarData() {
  const query = encodeURIComponent("select A, B, C, D, E offset 1")
  const docID = "1HK13K3bE8pdORkBzcI-NPxNsFUcYaMyqP_ulRJbB2P0"
  const sheetName = "calendar"
  const url = `https://docs.google.com/spreadsheets/d/${docID}/gviz/tq?sheet=${sheetName}&tq=${query}`

  const rawData = await fetch(url)
  const textData = await rawData.text()
  const jsonData = JSON.parse(textData.substring(47).slice(0, -2))

  const data = jsonData.table.rows.map(i => { return {
    date: i.c[0]?.v,
    isodate: i.c[1]?.v,
    location: i.c[2]?.v,
    title: i.c[3]?.v,
    description: i.c[4]?.v
  }})

  const currentDate = new Date();
  const filteredData = data.filter(event => {
    const date = new Date(event.isodate);
    return date >= currentDate;
  });

  const nextEvent = filteredData.reduce((a, b) => {
    const aDate = new Date(a.isodate);
    const bDate = new Date(b.isodate);
    return aDate < bDate ? a : b;
  });

  const message = document.getElementById("calendarMessage");

  if (nextEvent) {
    message.innerHTML = `
      <p class="inline mr-4">
        ${ nextEvent.date }: ${ nextEvent.title }.
      </p>
      <a href="/calendar" class="btn">more</a>
    `
  } else {
    message.innerHTML = `
      <p class="inline mr-4">No upcoming events for now. Check back soon for updates!</p>
    `  
  }
}
