let allEvents = []
let foundEvent
document.addEventListener('DOMContentLoaded', () => {
  console.log("still running");

  const eventsContainer = document.querySelector("#events-container")
  const jumbotronContainer = document.querySelector("#jumbotron")
  const newEventFormContainer = document.querySelector("#new-event-form")
  const categoriesNavController = document.querySelector("#categories-nav")
  const blogHeaderContainer = document.querySelector(".blog-header")

  // RENDER ALL EVENTS ON PAGE LOAD
  const endPoint = 'http://localhost:3000/api/v1/events';
  function renderAllEvents() {
    fetch(endPoint)
      .then(res => res.json())
      .then(events => {
        allEvents = events
        eventsContainer.innerHTML = ""
        console.log(events)
        mapAllEvents(events)
      });//END OF GET EVENTS FETCH
  }
  renderAllEvents()

  // MAP THROUGH EVENTS ARRAY AND CALL RENDEREVENTCARD()
  function mapAllEvents(events) {
    return events.map( event => {
      return eventsContainer.innerHTML += renderEventCard(event)
    });
  }

  //RENDERS HTML FOR INDIVIDUAL EVENT
  function renderEventCard(event) {
    const eventTime = formatTime(event)
    return `
    <div class="col-md-12">
      <div class="card flex-md-row mb-4 shadow-sm h-md-250">
        <div class="card-body d-flex flex-column align-items-start">
          <strong class="d-inline-block mb-2 text-success">${event.category}</strong>
          <h3 class="mb-0">
            <a class="text-dark">${event.title}</a>
          </h3>
          <div class="mb-1 text-muted">${event.date} ${eventTime}</div>
          <button class="btn btn-info btn-lg" data-action="more-info" data-id=${event.id}>Learn More</button>
        </div>
        <img src="${event.image_url}" style="width:50%; height:100%">

      </div>
    </div>`
  }

  blogHeaderContainer.addEventListener("click", e => {
    location.reload()
  })

  function formatTime(event) {
    let formattedTime
    const getTime = event.time.split("T")[1].split(".")[0]
    let getHour = getTime.split(":")[0]
    const getMinutes = getTime.split(":")[1]
    if (getHour > 12) {
      getHour -= 12
      formattedTime = getHour + ":" + getMinutes + " PM"
    } else {
      formattedTime = getTime.split(":").splice(0, 2).join(":") + " AM"
    }
    return formattedTime
  }

  // RENDER THE NEW EVENT FORM IN PLACE OF THE EVENTS INDEX
  jumbotronContainer.addEventListener("click", e => {
    e.preventDefault()
    if (e.target.dataset.id === "render-new-event-form") {
      renderNewEventForm()
    }
  })//END OF LISTENER

  // RE-CALL renderAllEvents() TO REMOVE NEW-FORM
  eventsContainer.addEventListener("click", e => {
    if (e.target.dataset.action === "cancel") {
      console.log("cancelling")
      renderAllEvents()
    }
    // CREATES NEW EVENT WITH POST REQUEST
    if (e.target.dataset.action === "submit") {
      e.preventDefault()
      const newEventTitle = document.querySelector('#title').value
      const newEventDuration = document.querySelector('#duration').value
      const newEventCategory = document.querySelector('#category').value
      const newEventLocation = document.querySelector('#location').value
      const newEventMinAttendance = document.querySelector('#min_attendance').value
      const newEventMaxAttendance = document.querySelector('#max_attendance').value
      const newEventDate = document.querySelector('#date').value
      const newEventTime = document.querySelector('#time').value
      const newEventImageURL = document.querySelector('#image_url').value
      const newEventDescription = document.querySelector('#description').value

      fetch(endPoint, {
        method: "POST",

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          "title": newEventTitle,
          "duration": newEventDuration,
          "category": newEventCategory,
          "location": newEventLocation,
          "min_capacity": newEventMinAttendance,
          "max_capacity": newEventMaxAttendance,
          "date": newEventDate,
          "time": newEventTime,
          "image_url": newEventImageURL,
          "description": newEventDescription
        })
      })
        .then(res => res.json())
        .then(newEvent => {
          renderAllEvents()
        })

    }
    // RENDER AN EVENT'S INFO "PAGE"
    if (e.target.dataset.action === "more-info") {
      foundEvent = allEvents.find( event => event.id == e.target.dataset.id)
      jumbotronContainer.style.display = "none"
      eventsContainer.innerHTML = renderEventInfo(foundEvent)
    }

    if (e.target.dataset.action === "join-event") {
      const eventId = e.target.dataset.id

    }
  })

  // NEW EVENT FORM
  function renderNewEventForm() {
    eventsContainer.innerHTML = `
    <form id="new-event-form" class="needs-validation" novalidate >
      <div class="form-row">
        <div class="col-md-4 mb-3">
          <label for="title">Title of Event</label>
          <input type="text" class="form-control" id="title" placeholder="Ex: Big Ass Rave" value="" required>
        </div>
        <div class="col-md-4 mb-3">
          <label for="duration">Duration (in hours)</label>
          <input type="number" class="form-control" id="duration" placeholder="Ex: 2" value="" required>
        </div>
        <div class="col-md-4 mb-3">
          <label for="category">Category</label>
          <select id="category" class="custom-select">
            <option selected>What kind of event is it?</option>
            <option value="Travel & Adventure">Travel & Adventure</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Culture">Culture</option>
            <option value="Career & Business">Career & Business</option>
            <option value="Food & Drink">Food & Drink</option>
            <option value="Family & Pets">Family & Pets</option>
            <option value="Learning">Learning</option>
            <option value="Health">Health</option>
            <option value="Style">Style</option>
            <option value="Party">Party</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-6 mb-3">
          <label for="location">Location</label>
          <input type="text" class="form-control" id="location" placeholder="Ex: Prospect Park" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="min_attendance">Minimum Attendance</label>
          <input type="number" class="form-control" id="min_attendance" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="max_attendance">Maximum Attendance</label>
          <input type="number" class="form-control" id="max_attendance" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="date">Date</label>
          <input type="date" class="form-control" id="date" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="time">Time</label>
          <input type="time" class="form-control" id="time" required>
        </div>
        <div class="col-md-6 mb-3">
          <label for="image_url">Image URL</label>
          <input type="text" class="form-control" id="image_url" placeholder="https://example.jpg" required>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-12 mb-0">
          <label for="description">Description</label>
          <textarea class="form-control" id="description" placeholder="Bring friends!" required></textarea>
        </div>
      </div><br>
      <button data-action="cancel" class="btn btn-primary">Cancel</button><button data-action="submit" class="btn btn-primary" type="submit">Submit form</button>
      </form>
    `
  }

  function renderEventInfo(event) {
    const eventTime = formatTime(event)
    return `
    <div class="col-md-6">
      <div class="card mb-12 box-shadow">
        <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="height: 300px; width: 100%; display: block;" src="${event.image_url}" data-holder-rendered="true">
        <div class="card-body">
          <h3>${event.title}</h3>
          <p class="card-text">${event.description}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button data-action="join-event" data-id="${event.id}" type="button" class="btn btn-sm btn-outline-secondary">Join Event</button>
            </div>
            <small class="text-muted">${event.date} ${eventTime}</small>
          </div>
        </div>
      </div>
    </div>
    `
  }

  categoriesNavController.addEventListener("click", e => {
    e.preventDefault()
    let filteredArray = []
    const target = e.target.dataset.id;
    if (target === "arts") {
      filterCategories("Art")
    }
    if (target === "sports") {
      filterCategories("Sports")
    }
    if (target === "travel-and-adventure") {
      filterCategories("Travel & Adventure")
    }
    if (target === "culture") {
      filterCategories("Culture")
    }
    if (target === "career-and-business") {
      filterCategories("Career & Business")
    }
    if (target === "food-and-drink") {
      filterCategories("Food & Drink")
    }
    if (target === "family-and-pets") {
      filterCategories("Family & Pets")
    }
    if (target === "health") {
      filterCategories("Health")
    }
    if (target === "learning") {
      filterCategories("Learning")
    }
    if (target === "style") {
      filterCategories("Style")
    }
    if (target === "party") {
      filterCategories("Party")
    }
  })//END OF CATEGORIES NAV LISTENER

  function filterCategories(category) {
    filteredArray = allEvents.filter( event => event.category == category)
    eventsContainer.innerHTML = ""
    jumbotronContainer.style.display = "none"
    return filteredArray.map( event => eventsContainer.innerHTML += renderEventCard(event))
  }

});//END OF DOM CONTENT LOADED

// <svg class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" width="200" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect fill="#55595c" width="100%" height="100%"></rect><text fill="#eceeef" dy=".3em" x="50%" y="50%">Thumbnail</text></svg>
