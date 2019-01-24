let allEvents = []
let foundEvent
let foundUserEvent
let currentUser
let allUsers = []
let allUserEvents = []
document.addEventListener('DOMContentLoaded', () => {
  console.log("still running");

  const eventsContainer = document.querySelector("#events-container")
  const jumbotronContainer = document.querySelector("#jumbotron")
  const newEventFormContainer = document.querySelector("#new-event-form")
  const categoriesNavController = document.querySelector("#categories-nav")
  const blogHeaderContainer = document.querySelector(".blog-header")
  const logInOrSignUpContainer = document.querySelector("#login-or-signup")
  const mainContainer = document.querySelector("#main")


  logInOrSignUpContainer.addEventListener("click", e => {
    if (e.target.dataset.action === "log-in") {
      logInOrSignUpContainer.innerHTML = `
      <form id="form-signin" class="text-center">
        <img class="mb-4" src="../../assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
        <label for="name" class="sr-only">Name</label>
        <input type="text" id="inputName" class="form-control" placeholder="Name" required="" autofocus="" value=""><br>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Log In</button>
      </form>
      `
      const signInFormContainer = document.querySelector("#form-signin")

      signInFormContainer.addEventListener("submit", e => {
        e.preventDefault()
        const returningUserName = (e.target.querySelector("#inputName").value)
        fetch('http://localhost:3000/api/v1/users')
        .then(resp => resp.json())
        .then( users => {
          currentUser = users.find(user => user.name === returningUserName)
          if (users.includes(currentUser)) {
            logInOrSignUpContainer.style.display = "none"
            mainContainer.style.display = "block"
            console.log(currentUser);
            renderAllEvents()
          } else {
            window.alert("You are not a user! Please sign up.")
            location.reload()
          }
        })
      })

    } else if (e.target.dataset.action === "sign-up") {
      logInOrSignUpContainer.innerHTML = `
      <form id="form-signup" class="text-center">
        <img class="mb-4" src="../../assets/brand/bootstrap-solid.svg" alt="" width="72" height="72">
        <h1 class="h3 mb-3 font-weight-normal">Please sign up</h1>
        <label for="name" class="sr-only">Name</label>
        <input type="text" id="inputName" class="form-control" placeholder="Name" required="" autofocus="" value=""><br>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Sign Up</button>
      </form>
      `
      const signUpFormContainer = document.querySelector("#form-signup")

      signUpFormContainer.addEventListener("submit", e => {
        const returningUserName = (e.target.querySelector("#inputName").value)
        fetch('http://localhost:3000/api/v1/users', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "name": returningUserName
          })
        })
        .then( resp => resp.json())
        .then( user => {
          const newUserInput = document.querySelector("#inputName").value
          if (allUsers.map( user => user.name ).includes(newUserInput)) {
            window.alert("You already have an account! Please sign in.")
            location.reload()
          } else {
            currentUser = user
            logInOrSignUpContainer.style.display = "none"
            mainContainer.style.display = "block"
            allUsers.push(currentUser)
            renderAllEvents()
          }
        })

      }) // End of signUpFormContainer listener
    // })
    }
  })

  fetch("http://localhost:3000/api/v1/users")
    .then( resp => resp.json())
    .then( users => allUsers = users)

  // RENDER ALL EVENTS ON PAGE LOAD
  const endPoint = 'http://localhost:3000/api/v1/events';
  function renderAllEvents() {
    fetch(endPoint)
      .then(res => res.json())
      .then(events => {
        allEvents = events
        eventsContainer.innerHTML = ""
        mapAllEvents(events)
      });//END OF GET EVENTS FETCH
  }
  // renderAllEvents()

  // MAP THROUGH EVENTS ARRAY AND CALL RENDEREVENTCARD()
  function mapAllEvents(events) {
    return events.map( event => {
      return eventsContainer.innerHTML += renderEventCard(event)
    });
  }

  //RENDERS HTML FOR INDIVIDUAL EVENT
  function renderEventCard(event) {
    const eventTime = formatTime(event)
    const eventDate = formatDate(event)
    const percentFull = Math.floor((event.users.length/event.max_capacity)*100)
    return `
    <div class="col-md-12">
      <div class="card flex-md-row mb-4 shadow-sm h-md-250">
        <div class="card-body d-flex flex-column align-items-start">
          <strong class="d-inline-block mb-2 text-success">${event.category}</strong>
          <h3 class="mb-0">
            <a class="text-dark">${event.title}</a>
          </h3>
          <div class="mb-1 text-muted">${eventDate} at ${eventTime}</div><br>
          <button class="btn btn-info btn-lg" data-action="more-info" data-id=${event.id}>Learn More</button><br>
          <h5 style="color:green">${percentFull}% full</h5>
        </div>
        <img src="${event.image_url}" style="width:50%; height:100%">
      </div>
    </div>`
  }

  blogHeaderContainer.addEventListener("click", e => {
    if (e.target.dataset.id === "rollick-logo") {
      console.log('this should re-render the home page');
      eventsContainer.innerHTML = ""
      jumbotronContainer.style.display = "block"
      allEvents.map (event => {
        eventsContainer.innerHTML += renderEventCard(event)
      })
    }
    if (e.target.dataset.id === "my-events") {
      console.log("this should render a page of all currentUser's events");
      jumbotronContainer.style.display = "none"
      eventsContainer.innerHTML = ""
      fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`)
        .then( resp => resp.json())
        .then( user => {
          console.log(user.events);
          user.events.map (event => {
            const currentEvent = allEvents.find( e => e.id === event.id )
            console.log(currentEvent);
            eventsContainer.innerHTML += renderEventCard(currentEvent)
          })
        })
    }
    if (e.target.dataset.id === "sign-out") {
      console.log('sign out');
      location.reload()
    }
  })

  // FIND CURRENTUSER EVENTS ----- close but have to get this working
  // function findMyEvents(currentUser) {
  //   const myUserEvents = allUserEvents.filter( userEvent => userEvent.user_id === currentUser.id)
  //   return myUserEvents.map( userEvent => {
  //     return allEvents.find( event => {
  //       return event.id === userEvent.event_id
  //     })
  //   })
  // }

  fetch("http://localhost:3000/api/v1/user_events")
    .then( resp => resp.json())
    .then( userEvents => {
      allUserEvents = userEvents
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

  function formatDate(event) {
    let formattedDate
    const dateArray = event.date.split("-")
    const dateYear = dateArray[0]
    const dateMonth = dateArray[1]
    const dateDay = dateArray[2]
    return `${dateMonth}/${dateDay}/${dateYear}`
  }


  // RENDER THE NEW EVENT FORM IN PLACE OF THE EVENTS INDEX
  jumbotronContainer.addEventListener("click", e => {
    e.preventDefault()
    if (e.target.dataset.id === "render-new-event-form") {
      eventsContainer.innerHTML = renderNewEventForm()
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
      fetch(`http://localhost:3000/api/v1/events/${foundEvent.id}`)
        .then( resp => resp.json())
        .then( event => {
          jumbotronContainer.style.display = "none"
          eventsContainer.innerHTML = renderEventInfo(event)
        })
    }

    if (e.target.dataset.action === "join-event") {
      e.preventDefault()
      if (foundEvent.max_capacity > foundEvent.users.length) {
        if (!(foundEvent.users.map( user => user.name ).includes(currentUser.name))) {
          const eventId = e.target.dataset.id
          let userEventObj
          fetch("http://localhost:3000/api/v1/user_events", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify({
              "user_id": currentUser.id,
              "event_id": eventId
            })
          })
          .then( resp => resp.json())
          .then( userEvent => {
            allUserEvents.push(userEvent)
            foundUserEvent = userEvent
            window.alert("Successfully Signed Up!")
            fetch(`${endPoint}/${userEvent.event_id}`)
            .then(resp => resp.json())
            .then( joinedEvent => {
              eventsContainer.innerHTML = renderEventInfo(joinedEvent)
              foundEvent = joinedEvent
              // const joinEventBtn = document.querySelector(".btn-outline-primary")
              // e.target.innerText = "Attending"
              // joinEventBtn.innerHTML = `<p style="color:green">Attending</p>`
            })
          })
        } else {
          window.alert("You're already attending!")
          // e.target.innerText = "Attending"
          // e.target.parentNode.innerHTML = `<p style="color:green">Attending</p>`
        }
      } else {
        window.alert("Sorry, that event is at capacity.")
      }
    }

    if (e.target.dataset.action === "leave-event") {
      foundUserEvent = allUserEvents.find( ue => ue.event_id === foundEvent.id && ue.user_id === currentUser.id)
      window.alert("WOW, ok rude. Really want to leave?")
      fetch(`http://localhost:3000/api/v1/user_events/${foundUserEvent.id}`, {method: "DELETE"})
      .then( resp => {
        fetch(`http://localhost:3000/api/v1/users/${currentUser.id}`)
          .then( resp => resp.json())
          .then( user => {
            jumbotronContainer.style.display = "none"
            eventsContainer.innerHTML = ""
            user.events.map( event => {
              const currentEvent = allEvents.find( e => e.id === event.id)
              eventsContainer.innerHTML += renderEventCard(currentEvent)
            })
          })
      })
      fetch(`http://localhost:3000/api/v1/events/${foundEvent.id}`)
        .then( resp => resp.json())
        .then( event => {})
    }

      if (e.target.dataset.action === "edit-event") {
        eventsContainer.innerHTML += `<br>
         ${renderEditEventForm(foundEvent)}
        `
      }
      if (e.target.dataset.action === "cancel-edit") {
        e.preventDefault()
        const editEventFormContainer = document.querySelector("#edit-event-form")
        editEventFormContainer.remove()
        console.log(foundEvent.id);
      }
      if (e.target.dataset.action === "submit-edit") {
        const editEventFormContainer = document.querySelector("#edit-event-form")
        const editEventTitle = document.querySelector("#title").value
        const editEventDescription = document.querySelector("#description").value
        const editEventLocation = document.querySelector("#location").value
        const editEventCategory = document.querySelector("#category").value
        const editEventMaxCapacity = document.querySelector("#max_attendance").value
        const editEventMinCapacity = document.querySelector("#min_attendance").value
        const editEventDate = document.querySelector("#date").value
        const editEventTime = document.querySelector("#time").value
        const editEventDuration = document.querySelector("#duration").value
        const editEventImageUrl = document.querySelector("#image_url").value
        fetch(`${endPoint}/${foundEvent.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            "title": editEventTitle,
            "description": editEventDescription,
            "location": editEventLocation,
            "category": editEventCategory,
            "max_capacity": editEventMaxCapacity,
            "min_capacity": editEventMinCapacity,
            "date": editEventDate,
            "time": editEventTime,
            "duration": editEventDuration,
            "image_url": editEventImageUrl
          })
        })
        .then( resp => resp.json())
        .then( edittedEvent => {
          editEventFormContainer.remove()
          eventsContainer.innerHTML = renderEventInfo(edittedEvent)
          console.log(edittedEvent);
        })
      }

      if (e.target.dataset.action === "delete-event") {
        console.log(foundEvent)
        fetch(`${endPoint}/${foundEvent.id}`, {
          method: "DELETE"
        })
        .then(res => {
          window.alert("bye bye")
          renderAllEvents()
        })

      }
  })//END OF eventsContainer Listener

  // NEW EVENT FORM
  function renderNewEventForm() {
    return `
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

  function renderEditEventForm(event) {
    return `
    <form id="edit-event-form" class="needs-validation" novalidate >
      <div class="form-row">
        <div class="col-md-4 mb-3">
          <label for="title">Title of Event</label>
          <input type="text" class="form-control" id="title" value="${event.title}" required>
        </div>
        <div class="col-md-4 mb-3">
          <label for="duration">Duration (in hours)</label>
          <input type="number" class="form-control" id="duration" value="${event.duration}" required>
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
          <input type="text" class="form-control" id="location" value="${event.location}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="min_attendance">Minimum Attendance</label>
          <input type="number" class="form-control" id="min_attendance" value="${event.min_capacity}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="max_attendance">Maximum Attendance</label>
          <input type="number" class="form-control" id="max_attendance" value="${event.max_capacity}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="date">Date</label>
          <input type="date" class="form-control" id="date" value="${event.date}" required>
        </div>
        <div class="col-md-3 mb-3">
          <label for="time">Time</label>
          <input type="time" class="form-control" id="time" value="" required>
        </div>
        <div class="col-md-6 mb-3">
          <label for="image_url">Image URL</label>
          <input type="text" class="form-control" id="image_url" value="${event.image_url}" required>
        </div>
      </div>
      <div class="form-row">
        <div class="col-md-12 mb-0">
          <label for="description">Description</label>
          <textarea class="form-control" id="description" value="${event.description}" required></textarea>
        </div>
      </div><br>
      <button data-action="cancel-edit" class="btn btn-primary">Cancel</button><button data-action="submit-edit" class="btn btn-primary" type="submit">Edit Event</button>
      </form>
    `
  }

  function showAttendees(event) {
    if (event.users.length < 10) {
      return event.users.map(user => {
        return `<li>${user.name}</li>`
      }).join('')
    } else {
      const lastTen = event.users.slice(event.users.length - 10, event.users.length)
      return lastTen.map(user => {
        return `<li>${user.name}</li>`
      }).join('')
    }
  }

  function renderEventInfo(event) {
    const eventTime = formatTime(event)
    const eventDate = formatDate(event)
    return `
    <div class="row">
      <div class="col-md-6">
        <div class="card mb-12 box-shadow">
          <img class="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" style="height: 300px; width: 100%; display: block;" src="${event.image_url}" data-holder-rendered="true">
          <div class="card-body">
            <h3>${event.title}</h3>
            <p class="card-text">${event.location}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="row">
                ${renderJoinLeaveButtons(event)}
              </div>
              <small class="text-muted">${eventDate} at ${eventTime}</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card mb-12 box-shadow">

          <div class="card-body">
            <p class="card-text">${event.description}</p>
          </div>
          <div class="card-body">
            <p class="card-text">${event.max_capacity - event.users.length} spots remaining out of ${event.max_capacity}</p>
          </div>
          <div class="card-body">
            <p class="card-text">Who's Attending:</p>
            <ul id="attendee-list">
              ${showAttendees(event)}
            </ul>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button data-action="edit-event" data-id="${event.id}" type="button" class="btn btn-sm btn-outline-info">Edit Event</button>
              </div>
              <div class="btn-group">
                <button data-action="delete-event" data-id="${event.id}" type="button" class="btn btn-sm btn-outline-danger">Delete Event</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  }
  // <div id="join-event-btn" class="btn-group">
  // <button id="join-event" data-action="join-event" data-id="${event.id}" type="button" class="btn btn-sm btn-outline-primary">Join Event</button>
  //
  // <button id="leave-event" data-action="leave-event" data-id="${event.id}" type="button" class="btn btn-sm btn-outline-danger" style="display:none">Leave Event</button>
  // </div>


  function renderJoinLeaveButtons(currentEvent) {
    if (currentEvent.users.map( user => user.name ).includes(currentUser.name)) {
      return `<button id="leave-event" data-action="leave-event" data-id="${currentEvent.id}" type="button" class="btn btn-sm btn-outline-danger" style="display:block">Leave Event</button>`
    } else {
      return `<button id="join-event" data-action="join-event" data-id="${currentEvent.id}" type="button" class="btn btn-sm btn-outline-primary">Join Event</button>`
    }
  }
  //


  categoriesNavController.addEventListener("click", e => {
    e.preventDefault()
    let filteredArray = []
    const target = e.target.dataset.id;
    if (target === "arts") {
      filterCategories("Arts")
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
      console.log("hit me");
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
    const filteredArray = allEvents.filter( event => event.category == category)
    eventsContainer.innerHTML = ""
    jumbotronContainer.style.display = "none"
    return filteredArray.map( event => eventsContainer.innerHTML += renderEventCard(event))
  }

});//END OF DOM CONTENT LOADED

// <svg class="bd-placeholder-img card-img-right flex-auto d-none d-lg-block" width="200" height="250" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect fill="#55595c" width="100%" height="100%"></rect><text fill="#eceeef" dy=".3em" x="50%" y="50%">Thumbnail</text></svg>
