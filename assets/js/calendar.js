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

  const list = document.getElementById("calendarList");
  while (list.firstChild) {
    list.removeChild(list.firstChild)
  }

  const currentDate = new Date();
  const filteredData = data.filter(event => {
    const date = new Date(event.isodate);
    return date >= currentDate;
  });

  if (filteredData.length == 0) {
    list.innerHTML = `
      <li class="ml-0 mb-4">No upcoming calendar entries for now.</li>
    `
  } else {
    for (let event of filteredData) {
      const newChild = document.createElement("li")
      newChild.className = "mb-4"
      newChild.innerHTML = `
        <ul class="list-none ml-0 pb-4">
          <li class="">${event.date}</li>
          <li class="font-bold">
            ${event.title}
            ${event.link ? `<a class="ml-4 btn" href="${event.link}">link</a>` : ""}
          </li>
          ${event.description ? `<li>${event.description}</li>` : ""}
          ${event.location ? `<li class="italic">${event.location}</li>` : ""}
        </ul>
      `
      list.appendChild(newChild)
    }
  }
}
